<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Mail\OrderDelivered;
use App\Mail\OrderShipped;
use App\Models\Order;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use Inertia\Inertia;
use Inertia\Response;

class OrderController extends Controller
{
    public function index(Request $request): Response
    {
        $query = Order::with(['user', 'items'])
            ->orderBy('created_at', 'desc');

        if ($search = $request->input('search')) {
            $query->where(function ($q) use ($search) {
                $q->where('order_number', 'like', "%{$search}%")
                    ->orWhereHas('user', fn ($u) => $u->where('name', 'like', "%{$search}%"));
            });
        }

        if ($status = $request->input('status')) {
            $query->where('status', $status);
        }

        $orders = $query->paginate(15)->withQueryString();

        return Inertia::render('admin/orders/index', [
            'orders' => $orders,
            'filters' => $request->only(['search', 'status']),
        ]);
    }

    public function show(Order $order): Response
    {
        $order->load(['user', 'items', 'messages.user', 'deliveryZone']);

        return Inertia::render('admin/orders/show', [
            'order' => $order,
            'authUserId' => auth()->id(),
        ]);
    }

    public function update(Request $request, Order $order): RedirectResponse
    {
        $validated = $request->validate([
            'status' => ['required', 'string', 'in:pending,confirmed,processing,shipped,delivered,cancelled'],
            'notes' => ['nullable', 'string', 'max:1000'],
        ]);

        $order->update($validated);

        match ($validated['status']) {
            'shipped' => Mail::to($order->user)->queue(new OrderShipped($order)),
            'delivered' => Mail::to($order->user)->queue(new OrderDelivered($order)),
            default => null,
        };

        return back()->with('success', "Order {$order->order_number} updated to {$validated['status']}.");
    }

    public function message(Request $request, Order $order): RedirectResponse
    {
        $data = $request->validate(['message' => ['required', 'string', 'max:1000']]);

        $order->messages()->create([
            'user_id' => auth()->id(),
            'message' => $data['message'],
        ]);

        return back()->with('success', 'Reply sent.');
    }
}
