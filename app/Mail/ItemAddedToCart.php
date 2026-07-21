<?php

namespace App\Mail;

use App\Models\Product;
use App\Models\User;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Attachment;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class ItemAddedToCart extends Mailable implements ShouldQueue
{
    use Queueable, SerializesModels;

    public function __construct(
        public Product $product,
        public int $quantity,
        public User $user,
    ) {}

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: "{$this->product->name} added to your cart",
        );
    }

    public function content(): Content
    {
        return new Content(
            markdown: 'emails.cart.added',
        );
    }

    public function attachments(): array
    {
        return [];
    }
}
