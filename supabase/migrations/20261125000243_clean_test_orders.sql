-- Clean all seeded test and demo orders to make database production-ready
DELETE FROM public.order_items;
DELETE FROM public.orders;
DELETE FROM public.newsletter_subscribers;
