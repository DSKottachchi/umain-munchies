import Chip from "./Chip";

interface Card {
    name: string;
    status: "open" | "closed";
    deliveryTime: number;
    image: string;
}

const Card = ({ name, status, deliveryTime, image }: Card) => {
    return (
        <div className="flex flex-col justify-between overflow-hidden w-[327px] h-[202px] p-4 bg-white border border-gray-200 rounded-lg transition-transform hover:scale-[1.02] dark:bg-gray-800 dark:border-gray-700">
            <div className="flex relative">
                <Chip label={status} color="" />
                {status == 'open' && (
                    <Chip label={`${deliveryTime.toString()} min`} color="" />
                )}

                <div className="absolute -top-12 -right-12">
                    <img
                        src={`${import.meta.env.VITE_BACKEND_BASE_URL}${image}`}
                        alt="Decoration"
                        className="w-[140px] h-[140px]"
                    />
                </div>
            </div>

            {status == 'closed' && (
                <div className="w-[157px] h-[28px] text-[12px] bg-[#FAFAFA] border border-gray-200 rounded-[4px]">Opens tomorrow at 12 pm</div>
            )}

            <div className="flex">
                <div className="dark:text-white">{name}</div>
                <a
                    href="#"
                    className="ml-auto text-white bg-[#00703A] rounded-full w-8 h-8 flex items-center justify-center"
                >
                    +
                </a>
            </div>
        </div>
    );
};

export default Card;
