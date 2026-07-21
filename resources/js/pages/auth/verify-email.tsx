import { Head, useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { dashboard } from '@/routes';
import Controllers from '@/actions/Laravel/Fortify/Http/Controllers';

export default function VerifyEmail({ status }: { status?: string }) {
    const { post, processing } = useForm();

    const resend = () => {
        post(Controllers.EmailVerificationNotificationController.store.url());
    };

    return (
        <>
            <Head title="Verify Email" />

            <div className="flex flex-col gap-6 text-center">
                <div className="space-y-2">
                    <h2 className="text-2xl font-semibold">Verify your email</h2>
                    <p className="text-muted-foreground text-sm">
                        Thanks for signing up! Before getting started, could you verify your email
                        address by clicking the link we just emailed to you? If you didn't receive
                        the email, we'll gladly send you another.
                    </p>
                </div>

                {status && (
                    <div className="rounded-md bg-green-50 p-3 text-sm font-medium text-green-600 dark:bg-green-950 dark:text-green-400">
                        {status}
                    </div>
                )}

                <Button
                    onClick={resend}
                    disabled={processing}
                    className="w-full"
                >
                    {processing && <Spinner />}
                    Resend Verification Email
                </Button>

                <p className="text-muted-foreground text-center text-sm">
                    <a
                        href={dashboard().url}
                        className="text-primary underline"
                    >
                        Skip for now
                    </a>
                </p>
            </div>
        </>
    );
}

VerifyEmail.layout = {
    title: 'Email Verification',
    description: 'Verify your email address to continue',
};
