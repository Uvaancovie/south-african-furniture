import { useState } from 'react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Separator } from '@/components/ui/separator';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

type FaqItem = {
    question: string;
    answer: string;
};

const defaultFaqs: FaqItem[] = [
    {
        question: 'What are the delivery options?',
        answer: 'We offer delivery across South Africa. Shipping costs are calculated based on your location and the weight of your order. You can get an estimated shipping cost using the Delivery Calculator on this page. Delivery typically takes 3–7 business days depending on your location.',
    },
    {
        question: 'What is the return policy?',
        answer: 'We accept returns within 14 days of delivery. Items must be unused and in their original packaging. Please contact our support team to initiate a return. Custom or made-to-order items are non-returnable unless faulty.',
    },
    {
        question: 'How long does assembly take?',
        answer: 'Most of our furniture comes fully assembled or requires minimal assembly. For items that require assembly, clear instructions and all necessary tools are included. Typical assembly time ranges from 15 to 45 minutes.',
    },
    {
        question: 'How do I care for my furniture?',
        answer: 'Dust regularly with a soft, dry cloth. Avoid placing furniture in direct sunlight to prevent fading. For spills, blot immediately with a clean, damp cloth — do not rub. For specific material care instructions, refer to the product specifications above.',
    },
    {
        question: 'Is there a warranty?',
        answer: 'All our furniture comes with a 12-month warranty against manufacturing defects. This covers structural issues but does not cover wear and tear from normal use, accidental damage, or improper care. Register your product after purchase to activate your warranty.',
    },
];

type Props = {
    faqs?: FaqItem[];
    title?: string;
};

export default function ProductFaq({ faqs = defaultFaqs, title = 'Frequently Asked Questions' }: Props) {
    const [openIndex, setOpenIndex] = useState<number | null>(null);

    function toggle(index: number) {
        setOpenIndex(prev => prev === index ? null : index);
    }

    return (
        <div className="rounded-xl border bg-card">
            <div className="px-6 py-4">
                <h2 className="text-lg font-semibold tracking-tight">{title}</h2>
            </div>
            <Separator />
            <div className="divide-y">
                {faqs.map((faq, i) => (
                    <Collapsible
                        key={i}
                        open={openIndex === i}
                        onOpenChange={() => toggle(i)}
                    >
                        <CollapsibleTrigger asChild>
                            <button
                                type="button"
                                className="flex w-full items-center justify-between px-6 py-4 text-left text-sm font-medium transition-colors hover:bg-muted/50"
                            >
                                {faq.question}
                                <ChevronDown
                                    className={cn(
                                        'size-4 shrink-0 text-muted-foreground transition-transform duration-200',
                                        openIndex === i && 'rotate-180',
                                    )}
                                />
                            </button>
                        </CollapsibleTrigger>
                        <CollapsibleContent>
                            <div className="px-6 pb-4 pt-0">
                                <p className="text-sm leading-relaxed text-muted-foreground">
                                    {faq.answer}
                                </p>
                            </div>
                        </CollapsibleContent>
                    </Collapsible>
                ))}
            </div>
        </div>
    );
}
