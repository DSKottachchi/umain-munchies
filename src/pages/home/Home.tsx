import { useEffect, useState } from "react";
import Card from "../../components/ui/Card";
import { Categories } from '../../utils/data.ts';

type Restaurant = {
    id: string;
    name: string;
    rating: number;
    filter_ids: string[];
    image_url: string;
    delivery_time_minutes: number;
    price_range_id: string;
};

const Home = () => {
    const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchRestuarants = async () => {
            try {
                const response = await fetch(`${import.meta.env.VITE_BACKEND_BASE_URL}/api/restaurants`);
                if (!response.ok) {
                    throw new Error(`Error: ${response.status}`);
                }
                const result = await response.json();
                console.log(result)
                setRestaurants(result.restaurants);
                console.log(restaurants)

            } catch (err) {
                if (err instanceof Error) {
                    setError(err.message);
                } else {
                    setError("An unexpected error occurred");
                }
            } finally {
                setLoading(false);
            }
        };

        fetchRestuarants();
    }, []);

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error}</p>;

    // Skeleton

    return (
        <div className="min-h-screen bg-white">
            <header>
                <h1 className="text-2xl font-bold flex items-center gap-2 py-4">
                    <span className="text-xl">🍜</span> Munchies
                </h1>
            </header>

            <div className="flex">
                <aside className="bg-white border border-gray-200 rounded-lg w-64 hidden md:block">
                    Filter
                </aside>

                <div className="flex-1">
                    <div className="flex mb-2">
                        {
                            Categories.map((category) => (
                                <div className="flex bg-white border border-gray-200 rounded-lg pt-2 pb-4 pl-2 mr-2 w-[160px] h-[80px]">
                                    <div className="">
                                        {category.name}
                                    </div>
                                    <img
                                        className="ml-auto w-[80px] h-[80px]"
                                        src={`${import.meta.env.VITE_BACKEND_BASE_URL}/images/${category.icon}`}
                                        alt="icons"
                                    />
                                </div>
                            ))
                        }
                    </div>

                    <div className="mb-2">
                        <h2>
                            Restaurant's
                        </h2>
                    </div>
                    <div className="flex flex-wrap">
                        {restaurants && Array.isArray(restaurants) ? (
                            restaurants.map((restaurant) => (
                                <Card
                                    key={restaurant.id}
                                    name={restaurant.name}
                                    status={'open'}
                                    deliveryTime={restaurant.delivery_time_minutes}
                                    image={restaurant.image_url}
                                />
                            ))
                        ) : (
                            <p>No restaurants available.</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Home;
