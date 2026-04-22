-- Add unique constraint: one redemption per user per coupon
ALTER TABLE public.coupon_redemptions 
ADD CONSTRAINT unique_user_coupon UNIQUE (user_id, coupon_id);

-- Create a function to enforce single-use per customer on coupon validation
CREATE OR REPLACE FUNCTION public.validate_coupon_redemption()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  -- Check if user already redeemed this coupon
  IF EXISTS (
    SELECT 1 FROM public.coupon_redemptions
    WHERE user_id = NEW.user_id AND coupon_id = NEW.coupon_id
  ) THEN
    RAISE EXCEPTION 'This coupon has already been used by this account';
  END IF;
  
  -- Increment current_uses on the coupon
  UPDATE public.coupons 
  SET current_uses = current_uses + 1 
  WHERE id = NEW.coupon_id;
  
  RETURN NEW;
END;
$$;

-- Attach trigger
CREATE TRIGGER enforce_single_use_coupon
BEFORE INSERT ON public.coupon_redemptions
FOR EACH ROW
EXECUTE FUNCTION public.validate_coupon_redemption();