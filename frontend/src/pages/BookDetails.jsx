import { toast } from "react-hot-toast";
import { load } from "@cashfreepayments/cashfree-js";
import { useDispatch, useSelector } from "react-redux";
import { addToFavs, removeFromFavs } from "../store/favouriteSlice";
import { Heart, ShoppingBag, Loader2 } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

const BookDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [cashfree, setCashfree] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { favourites } = useSelector((state) => state.favourites);

  const isFav = favourites.some((f) => f._id === id);

  useEffect(() => {
    const initCashfree = async () => {
      const cf = await load({ mode: "sandbox" }); // or "production"
      setCashfree(cf);
    };
    initCashfree();
  }, []);

  useEffect(() => {
    const fetchBookDetails = async () => {
      try {
        const { data } = await axios.get(
          `http://localhost:5000/api/books/${id}`,
        );
        setBook(data);
        console.log("data is ", data);
        setLoading(false);
      } catch (error) {
        toast.error("Failed to load book details");
        console.log(error);
        setLoading(false);
      }
    };
    fetchBookDetails();
  }, [id, dispatch]);

  const toggleFav = (e) => {
    e.preventDefault();
    if (!user) {
      toast.error("Please login to add favourites");
      navigate("/login");
      return;
    }
    if (isFav) {
      dispatch(removeFromFavs(id));
      toast.success("Removed from favourites");
    } else {
      dispatch(addToFavs(book));
      toast.success("Added to favourites");
    }
  };

  const handlePayment = async () => {
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));
    if (!userInfo) {
      toast.error("Please login to buy a book");
      navigate("/login");
      return;
    }

    setIsProcessing(true);

    try {
      // ✅ BEFORE calling Cashfree checkout
      localStorage.setItem(
        "pendingOrder",
        JSON.stringify({
          bookId: book._id,
          price: book.price,
        }),
      );
      // 1. Create CashFree order on backend
      const { data: orderData } = await axios.post(
        "http://localhost:5000/api/orders/cashfree",
        { amount: book.price, bookId: book._id },
        { headers: { Authorization: `Bearer ${userInfo.token}` } },
      );

      // 2. Initiate checkout
      let checkoutOptions = {
        paymentSessionId: orderData.payment_session_id,
        redirectTarget: "_self",
      };

      cashfree.checkout(checkoutOptions).then((result) => {
        if (result.error) {
          toast.error(result.error.message);
        }
        if (result.redirect) {
          console.log("Redirected to payment page");
        }
      });
    } catch (error) {
      toast.error(error.response?.data?.message || "Error initiating payment");
    } finally {
      setIsProcessing(false);
    }
  };

  if (loading) return <div className="text-center py-20">Loading...</div>;
  if (!book) return <div className="text-center py-20">Book not found</div>;

  return (
    <div className="max-w-4xl mx-auto p-6 bg-slate-900 rounded-xl shadow-2xl mt-10">
      <div className="flex flex-col md:flex-row gap-8">
        <div className="flex-1">
          <div className="grid grid-cols-2 gap-2">
            {book.images.map((img, index) => (
              <img
                key={index}
                src={`http://localhost:5000${img}`}
                alt={book.title}
                className="w-full h-48 object-cover rounded-lg border border-slate-700"
              />
            ))}
          </div>
        </div>
        <div className="flex-1 flex flex-col justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">{book.title}</h1>
            <p className="text-xl text-primary font-semibold mb-4">
              by {book.author}
            </p>
            <div className="flex items-center gap-4 mb-6">
              <span className="text-2xl font-bold text-green-400">
                ₹{book.price}
              </span>
              <span className="px-3 py-1 bg-slate-800 text-xs rounded-full text-slate-400">
                {book.category}
              </span>
            </div>
            <p className="text-slate-300 leading-relaxed mb-8">
              {book.description}
            </p>
          </div>
          <div className="flex flex-col gap-3">
            <button
              onClick={handlePayment}
              disabled={isProcessing}
              className="w-full py-4 bg-primary hover:bg-primary/90 text-white font-bold rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-primary/20 disabled:opacity-50"
            >
              {isProcessing ? (
                <Loader2 className="animate-spin" />
              ) : (
                <ShoppingBag size={20} />
              )}
              <span>Buy Now (CashFree)</span>
            </button>
            <button
              onClick={toggleFav}
              className={`w-full py-4 border rounded-xl font-bold transition-all flex items-center justify-center gap-2 ${isFav ? "bg-red-500/10 border-red-500 text-red-500 hover:bg-red-500 hover:text-white" : "bg-slate-800 hover:bg-slate-700 border-white/10 text-white"}`}
            >
              <Heart size={20} fill={isFav ? "currentColor" : "none"} />
              <span>
                {isFav ? "Remove from Favourite" : "Add to Favourite"}
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookDetails;
