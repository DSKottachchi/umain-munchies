import { useEffect, useState } from "react";
import Card from "../../components/ui/Card";
import { Categories } from '../../utils/data.ts';
import { Restaurant, Filter, PriceRange } from '../../types/index.ts';

const Home = () => {
    const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
    const [filters, setFilters] = useState<Filter[]>([]);
    const [priceRanges, setPriceRange] = useState<PriceRange[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchPriceRange();
        fetchRestuarants();
        fetchFilters();
    }, []);

    const fetchRestuarants = async () => {
        try {
            const response = await fetch(`${import.meta.env.VITE_BACKEND_BASE_URL}/api/restaurants`);
            if (!response.ok) {
                throw new Error(`Error: ${response.status}`);
            }
            const result = await response.json();
            setRestaurants(result.restaurants);

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

    const fetchFilters = async () => {
        try {
            const response = await fetch(`${import.meta.env.VITE_BACKEND_BASE_URL}/api/filter`);
            if (!response.ok) {
                throw new Error(`Error: ${response.status}`);
            }
            const result = await response.json();
            setFilters(result.filters);
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

    const fetchPriceRange = async () => {
        try {
            const response = await fetch(`${import.meta.env.VITE_BACKEND_BASE_URL}/api/price-range`);
            if (!response.ok) {
                throw new Error(`Error: ${response.status}`);
            }
            const result = await response.json();
            setPriceRange(result);
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

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error}</p>;

    // Skeleton

    return (
        <div className="min-h-screen bg-white">
            <header className="mb-10">
                <img
                    className=""
                    src='logo_dark.svg'
                    alt="icons"
                />
            </header>

            <div className="flex">
                <aside className="p-6 bg-white border border-gray-200 rounded-lg w-64 hidden md:block mr-4">
                    <div className="mb-6">Filter</div>
                    <div className="mb-6 uppercase text-slate-300">Food Category</div>
                    <div className="mb-4">
                        {
                            filters.map((filter) => (
                                <button
                                    className={`inline-flex items-center w-fit h-fit p-2 mr-2 mb-2 gap-2 rounded-[8px] border-[0.6px]`}
                                >
                                    <span className="text-sm font-medium text-gray-800">{filter.name}</span>
                                </button>
                            ))
                        }
                    </div>


                    <div className="mb-6 uppercase text-slate-300">Delivery Time</div>
                    <div className="mb-4">
                        {
                            filters.map((filter) => (
                                <button
                                    className={`inline-flex items-center w-fit h-fit p-2 mr-2 mb-2 gap-2 rounded-[8px] border-[0.6px]`}
                                >
                                    <span className="text-sm font-medium text-gray-800">{filter.name}</span>
                                </button>
                            ))
                        }
                    </div>

                    <div className="mb-6 uppercase text-slate-300">Price Range</div>
                    <div className="mb-4">
                        {
                            priceRanges.map((priceRange) => (
                                <button
                                    className={`inline-flex items-center w-fit h-fit p-2 mr-2 mb-2 gap-2 rounded-[8px] border-[0.6px]`}
                                >
                                    <span className="text-sm font-medium text-gray-800">{priceRange.range}</span>
                                </button>
                            ))
                        }
                    </div>
                </aside>

                <div className="flex-1">
                    <div className="flex mb-2">
                        {
                            filters.map((filter) => (
                                <div className="flex bg-white border border-gray-200 rounded-lg pt-2 pb-4 pl-2 mr-2 w-[160px] h-[80px]">
                                    <div className="text-sm font-medium text-gray-700">
                                        {filter.name}
                                    </div>
                                    <img
                                        className="ml-auto w-[80px] h-[80px] object-contain"
                                        src={`${import.meta.env.VITE_BACKEND_BASE_URL}${filter.image_url}`}
                                        alt="icons"
                                    />
                                </div>
                            ))
                        }
                    </div>

                    <div className="mt-4 mb-2">
                        <h2 className="text-[2rem]">
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
