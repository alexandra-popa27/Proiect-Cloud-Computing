import React, { useState } from "react";
import { useRouter } from "next/router";

const ViewDetails = (props) => {
  const router = useRouter();
  const { entry } = props;
  const [data] = useState(entry);

  const handleBack = () => {
    router.push("/main");
  };

  return (
    <div className="min-h-screen bg-beige flex flex-col">
      {/* Scrollable content container */}
      <div className="flex-1 overflow-y-auto px-4 pb-32 max-w-md mx-auto">
        <div className="relative h-60 overflow-hidden p-4">
          <img
            className="absolute inset-0 w-full h-full object-cover"
            src={data.image || ""}
            alt="Recipe image"
          />
          <div className="absolute inset-0 flex items-center justify-center text-white text-4xl font-bold tracking-tight text-center">
            {data.name || ""}
          </div>
        </div>

        {/* Recipe details */}
        <div className="mb-5">
          <label className="block text-sm font-bold text-gray-700">Chef</label>
          <div className="text-sm text-gray-900 border-b-2 border-gray-300">{data.chefName || "Unknown"}</div>
        </div>

        <div className="mb-5">
          <label htmlFor="ingredients" className="block text-sm font-bold text-gray-700">Ingredients</label>
          <div id="ingredients" className="text-sm text-gray-900 border-b-2 border-gray-300">
            {data.ingredients?.map((ingredient, index) => (
              <div key={index}>{ingredient}</div>
            ))}
          </div>
        </div>

        <div className="mb-5">
          <label htmlFor="instructions" className="block text-sm font-bold text-gray-700">Instructions</label>
          <div id="instructions" className="text-sm text-gray-900 border-b-2 border-gray-300">
            {Array.isArray(data.instructions)
              ? data.instructions.map((instruction, index) => <div key={index}>{instruction}</div>)
              : (data.instructions || "").split("\n").map((instruction, index) => <div key={index}>{instruction}</div>)
            }
          </div>
        </div>

        <div className="grid md:grid-cols-2 md:gap-6">
          <div className="relative z-0 w-full mb-5 group">
            <label className="block text-sm font-bold text-gray-700">Prepping time in minutes</label>
            <div className="text-sm text-gray-900 border-b-2 border-gray-300">{data.prepTimeMinutes}</div>
          </div>
          <div className="relative z-0 w-full mb-5 group">
            <label className="block text-sm font-bold text-gray-700">Cooking time in minutes</label>
            <div className="text-sm text-gray-900 border-b-2 border-gray-300">{data.cookTimeMinutes}</div>
          </div>
        </div>

        <div className="relative z-0 w-full mb-5 group">
          <label className="block text-sm font-bold text-gray-700">Number of servings</label>
          <div className="text-sm text-gray-900 border-b-2 border-gray-300">{data.servings}</div>
        </div>

        <div className="grid md:grid-cols-3 md:gap-6">
          <div className="relative z-0 w-full mb-5 group">
            <label className="block text-sm font-bold text-gray-700">Difficulty</label>
            <div className="text-sm text-gray-900 border-b-2 border-gray-300">{data.difficulty}</div>
          </div>
          <div className="relative z-0 w-full mb-5 group">
            <label className="block text-sm font-bold text-gray-700">Cuisine</label>
            <div className="text-sm text-gray-900 border-b-2 border-gray-300">{data.cuisine}</div>
          </div>
          <div className="relative z-0 w-full mb-5 group">
            <label className="block text-sm font-bold text-gray-700">Calories/Serving</label>
            <div className="text-sm text-gray-900 border-b-2 border-gray-300">{data.caloriesPerServing}</div>
          </div>
        </div>

        <div className="mb-5">
          <label className="block text-sm font-bold text-gray-700">Tags</label>
          <div className="text-sm text-gray-900 border-b-2 border-gray-300">
            {data.tags?.map((tag, index) => (
              <div key={index}>{tag}</div>
            ))}
          </div>
        </div>

        <div className="mb-5">
          <label className="block text-sm font-bold text-gray-700">Meal Types</label>
          <div className="text-sm text-gray-900 border-b-2 border-gray-300">{data.mealType}</div>
        </div>

        <div className="flex justify-center mt-8">
          <button
            type="button"
            className="text-white bg-gradient-to-br from-pink-500 to-orange-400 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-pink-200 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
            onClick={handleBack}
          >
            Go back to the recipe list
          </button>
        </div>
      </div>

      {/* Bottom Nav */}
      <div className="fixed bottom-0 left-0 w-full bg-gray-800 text-white flex justify-around py-3 border-t border-gray-700 z-50">
        <button onClick={() => router.push("/profile")} className="flex items-center gap-2 text-sm hover:text-yellow-400">
          <img src="/profile_icon.jpg" alt="Profile" className="w-5 h-5 rounded-full" />
          Profile
        </button>
        <button onClick={() => router.push("/feed")} className="flex items-center gap-2 text-sm hover:text-yellow-400">
          <img src="/feed_icon.png" alt="Feed" className="w-5 h-5 rounded-full" />
          Feed
        </button>
        <button onClick={() => router.push("/requests")} className="flex items-center gap-2 text-sm hover:text-yellow-400">
          <img src="/request_icon.jpg" alt="Requests" className="w-5 h-5 rounded-full" />
          Requests
        </button>
        <button className="flex items-center gap-2 text-sm hover:text-yellow-400">
          <img src="/AI_chat_icon.jpg" alt="CookAId" className="w-5 h-5 rounded-full" />
          CookAId
        </button>
      </div>
    </div>
  );
};

export default ViewDetails;
