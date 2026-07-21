<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\Mail;

class MailTest extends Command
{
    protected $signature = 'mail:test {email? : Email address to send the test to}';
    protected $description = 'Send a test email to verify mail configuration';

    public function handle()
    {
        $email = $this->argument('email') ?: $this->ask('Email address to send test to');

        Mail::raw(
            'This is a test email from South African Funeral Supplies. Your mail configuration is working!',
            fn ($message) => $message->to($email)->subject('Test Email - South African Funeral Supplies')
        );

        $this->info("Test email sent to {$email}!");
    }
}
