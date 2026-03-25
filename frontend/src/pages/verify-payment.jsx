import { useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const VerifyPayment = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const verify = async () => {
      const params = new URLSearchParams(window.location.search);
      const orderId = params.get("order_id");

      const userInfo = JSON.parse(localStorage.getItem("userInfo"));

      if (!orderId || !userInfo) {
        navigate("/");
        return;
      }

      try {
        const pending = JSON.parse(localStorage.getItem("pendingOrder"));

        await axios.get(
          `http://localhost:5000/api/orders/verify/${orderId}?bookId=${pending?.bookId}`,
          {
            headers: {
              Authorization: `Bearer ${userInfo.token}`,
            },
          },
        );

        console.log("✅ Order saved from backend");
        navigate("/profile");
      } catch (error) {
        console.error(error);
        navigate("/profile");
      }
    };

    verify();
  }, [navigate]);

  return <h1>Verifying Payment...</h1>;
};

export default VerifyPayment;
