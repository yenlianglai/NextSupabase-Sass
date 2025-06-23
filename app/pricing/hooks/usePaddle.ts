import { useState, useEffect } from "react";
import { initializePaddle, Paddle } from "@paddle/paddle-js";
import { toast } from "sonner";

interface UsePaddleReturn {
  paddle: Paddle | undefined;
  isReady: boolean;
  createSubscription: (planProductId: string, customerId: string) => void;
}

export function usePaddle(): UsePaddleReturn {
  const [paddle, setPaddle] = useState<Paddle | undefined>(undefined);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const initPaddle = async () => {
      try {
        const paddleInstance = await initializePaddle({
          environment: "sandbox",
          token: process.env.NEXT_PUBLIC_PADDLE_CLIENT_TOKEN!,
        });
        setPaddle(paddleInstance);
        setIsReady(true);
      } catch (error) {
        console.error("Failed to initialize Paddle:", error);
        toast.error(
          "Failed to initialize payment system. Please reload the page."
        );
      }
    };

    initPaddle();
  }, []);

  const createSubscription = (planProductId: string, customerId: string) => {
    if (!paddle || !customerId) {
      toast.error("Payment system not initialized. Please reload the page.");
      return;
    }

    toast.info("Opening checkout...");

    paddle.Checkout.open({
      customer: {
        id: customerId,
      },
      settings: {
        displayMode: "overlay",
        theme: "light",
        locale: "en",
        successUrl: `${window.location.origin}/protected`,
      },
      items: [
        {
          priceId: planProductId,
          quantity: 1,
        },
      ],
    });
  };

  return {
    paddle,
    isReady,
    createSubscription,
  };
}
