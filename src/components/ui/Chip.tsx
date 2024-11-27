
interface Chip {
    label: string;
    color: boolean;
}

const Chip = ({ label, color }: Chip) => {
    return (
        <div
            className={`inline-flex items-center w-fit h-fit px-3 py-2 gap-2 rounded-[88px] border border-stroke mr-1`}
        >
            {color &&
                <span className={`w-2 h-2 rounded-full ${label == "open" ? "bg-green" : "bg-black"}`} />
            }
            <span className="text-xs font-medium text-gray-800">{label}</span>
        </div>
    );
};

export default Chip;
