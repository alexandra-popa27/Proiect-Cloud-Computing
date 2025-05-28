import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/router";
import { GoogleMap, Marker, useJsApiLoader } from "@react-google-maps/api";

const containerStyle = {
  width: "100%",
  height: "400px",
};

const centerDefault = {
  lat: 44.4268,
  lng: 26.1025,
};

const MapPage = () => {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [usersMap, setUsersMap] = useState({});
  const [allReviews, setAllReviews] = useState([]);
  const [friendsLocations, setFriendsLocations] = useState([]);
  const [selectedRestaurant, setSelectedRestaurant] = useState(null);
  const [location, setLocation] = useState(null);
  const [restaurantName, setRestaurantName] = useState("");
  const [formattedAddress, setFormattedAddress] = useState("");
  const [rating, setRating] = useState(1);
  const [comment, setComment] = useState("");
  const [showMap, setShowMap] = useState(false);
  const [inputName, setInputName] = useState("");
  const addressRef = useRef();

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
  });

  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (stored) {
      const parsed = JSON.parse(stored);
      setUser(parsed);
      fetchData(parsed);
    }
  }, []);

  const fetchData = async (currentUser) => {
    const [reviewsRes, usersRes] = await Promise.all([
      fetch("/api/reviews"),
      fetch("/api/users"),
    ]);
    const reviewsData = await reviewsRes.json();
    const usersData = await usersRes.json();

    const mapUsers = {};
    usersData.data.forEach((u) => {
      mapUsers[u._id] = u;
    });
    setUsersMap(mapUsers);

    const friendIds = new Set([currentUser._id, ...(currentUser.friends || [])]);
    const friendReviews = reviewsData.data.filter((r) =>
      friendIds.has(r.reviewerId)
    );
    setAllReviews(friendReviews);

    // Group by restaurantName for unique pinning
    const uniqueRestaurants = {};
    friendReviews.forEach((r) => {
      if (!uniqueRestaurants[r.restaurantName]) {
        uniqueRestaurants[r.restaurantName] = {
          restaurantName: r.restaurantName,
          lat: r.lat,
          lng: r.lng,
        };
      }
    });
    setFriendsLocations(Object.values(uniqueRestaurants));
  };

  const geocodeAddress = async () => {
    const address = addressRef.current.value;
    if (!address.trim()) return;
  
    setInputName(address);
    const geocoder = new window.google.maps.Geocoder();
    geocoder.geocode({ address }, async (results, status) => {
      if (status === "OK" && results.length > 0) {
        const loc = results[0].geometry.location;
        const foundLat = loc.lat();
        const foundLng = loc.lng();
        const formatted = results[0].formatted_address;
  
        // verificăm dacă userul a dat deja review la restaurantul cu acest nume
        const duplicate = allReviews.some(
          (r) =>
            r.restaurantName.trim().toLowerCase() === address.trim().toLowerCase() &&
            r.reviewerId === user._id
        );
  
        if (duplicate) {
          alert("You already left a review for this restaurant and you can't leave another one. Try another restaurant to review.");
          return;
        }
  
        setLocation({ lat: foundLat, lng: foundLng });
        setFormattedAddress(formatted);
        setRestaurantName(address);
        setShowMap(true);
        setSelectedRestaurant(null);
      } else {
        alert("We could not find the restaurant you searched.");
      }
    });
  };

  const submitReview = async () => {
    if (!user || !restaurantName || !comment || !location) return;

    const review = {
      restaurantName: inputName,
      lat: location.lat,
      lng: location.lng,
      reviewerId: user._id,
      score: rating,
      comment,
    };

    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(review),
      });

      if (res.ok) {
        alert("Review submitted!");
        setComment("");
        setLocation(null);
        setRestaurantName("");
        setFormattedAddress("");
        setShowMap(false);
        addressRef.current.value = "";
        fetchData(user);
      } else {
        alert("Failed to submit review.");
      }
    } catch (err) {
      console.error(err);
      alert("Error submitting review.");
    }
  };

  return (
    <div className="relative bg-beige min-h-screen pb-24">
      {/* Header */}
      <div className="relative h-96 overflow-hidden">
        <img className="absolute inset-0 w-full h-full object-cover" src="/cooking.jpg" alt="Cooking Background" />
        <div className="absolute inset-0 flex items-center justify-center text-white text-4xl font-bold tracking-tight text-center">
          Friends on the Map
        </div>
      </div>

      {/* Friends Map Section */}
      <div className="bg-white mt-4 mx-4 p-4 rounded-lg shadow border">
        <h2 className="text-xl font-bold text-center text-gray-700 mb-2">Check the restaurants your friends have tried.</h2>
        {isLoaded && (
          <GoogleMap
            mapContainerStyle={containerStyle}
            center={centerDefault}
            zoom={12}
            onClick={() => setSelectedRestaurant(null)}
          >
            {friendsLocations.map((r, idx) => (
            <Marker
                key={idx}
                position={{ lat: r.lat, lng: r.lng }}
                onClick={() => setSelectedRestaurant(r.restaurantName)}
                title={r.restaurantName} // se afișează la hover
            />
            ))}
          </GoogleMap>
        )}

        {selectedRestaurant && (
          <div className="mt-4 p-4 bg-gray-100 rounded shadow-inner">
            <h3 className="text-lg font-semibold">Restaurant: {selectedRestaurant}</h3>
            <div className="mt-2 flex flex-col gap-4">
              {allReviews
                .filter((r) => r.restaurantName === selectedRestaurant)
                .map((review, idx) => {
                  const reviewer = usersMap[review.reviewerId];
                  const profileImage = reviewer?.profilePicture?.trim() !== "" ? reviewer.profilePicture : "/profile_icon.jpg";
                  const name = reviewer?.name || "Unknown";
                  const date = new Date(review.createdAt).toLocaleString("en-GB", {
                    day: "2-digit",
                    month: "long",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  });

                  return (
                    <div key={idx} className="bg-white p-3 rounded border shadow-sm relative">
                      <div className="flex items-center gap-3">
                        <img src={profileImage} alt="Profile" className="w-10 h-10 rounded-full object-cover" />
                        <div>
                          <div className="font-bold text-gray-800">{name}</div>
                          <div className="text-sm text-gray-600">Score: {review.score} ⭐</div>
                          <div className="text-gray-700">{review.comment}</div>
                        </div>
                      </div>
                      <div className="absolute top-2 right-3 text-xs text-gray-400">{date}</div>
                    </div>
                  );
                })}
            </div>
          </div>
        )}
      </div>

      {/* User Review Form Section */}
      <div className="flex flex-col lg:flex-row p-4 gap-4 mt-8">
        <div className="lg:w-1/2 bg-white border border-gray-300 rounded-lg shadow-md p-4">
          <h2 className="text-lg font-semibold text-gray-700 mb-4">
            Have you tried a new restaurant? Tell your friends about it.
          </h2>
          <input
            type="text"
            ref={addressRef}
            placeholder="Type the name of a restaurant..."
            className="w-full border p-2 rounded mb-4"
          />
          <button
            onClick={geocodeAddress}
            className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
          >
            Pin a new Restaurant Visit
          </button>

          {formattedAddress && (
            <p className="mt-4 text-green-700 font-semibold">
              You have been at: <span className="italic">{formattedAddress}</span>
            </p>
          )}

          {location && (
            <>
              <div className="mt-4">
                <label className="block">Rate this place:</label>
                <select
                  value={rating}
                  onChange={(e) => setRating(Number(e.target.value))}
                  className="border p-2 rounded w-full"
                >
                  {[1, 2, 3, 4, 5].map((val) => (
                    <option key={val} value={val}>
                      {val} ⭐
                    </option>
                  ))}
                </select>
              </div>

              <div className="mt-4">
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  maxLength={100}
                  placeholder="Write a short review (max 100 characters)."
                  className="w-full border p-2 rounded"
                />
              </div>

              <button
                onClick={submitReview}
                className="mt-2 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
              >
                Submit Review
              </button>
            </>
          )}
        </div>

        {/* User map preview */}
        {isLoaded && showMap && (
        <div className="lg:w-1/2 h-96 border border-gray-300 rounded-lg overflow-hidden">
            <GoogleMap mapContainerStyle={containerStyle} center={location || centerDefault} zoom={14}>
            {location && (
                <Marker
                position={location}
                title={inputName} // acest tooltip apare la hover
                />
            )}
            </GoogleMap>
        </div>
        )}
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 w-full bg-gray-800 text-white flex justify-around py-3 border-t border-gray-700 z-50">
        <button onClick={() => router.push("/profile")} className="flex items-center gap-2 text-sm hover:text-yellow-400">
          <img src="/profile_icon.jpg" alt="Profile" className="w-5 h-5 rounded-full" />Profile
        </button>
        <button onClick={() => router.push("/feed")} className="flex items-center gap-2 text-sm hover:text-yellow-400">
          <img src="/feed_icon.png" alt="Feed" className="w-5 h-5 rounded-full" />Feed
        </button>
        <button onClick={() => router.push("/requests")} className="flex items-center gap-2 text-sm hover:text-yellow-400">
          <img src="/request_icon.jpg" alt="Requests" className="w-5 h-5 rounded-full" />Requests
        </button>
        <button onClick={() => router.push("/main")} className="flex items-center gap-2 text-sm hover:text-yellow-400">
          <img src="/recipie_icon.jpg" alt="Recipies" className="w-5 h-5 rounded-full" />Recipies
        </button>
        <button onClick={() => router.push("/cookaid")} className="flex items-center gap-2 text-sm hover:text-yellow-400">
          <img src="/AI_chat_icon.jpg" alt="CookAId" className="w-5 h-5 rounded-full" /> CookAId
        </button>
      </div>
    </div>
  );
};

export default MapPage;
