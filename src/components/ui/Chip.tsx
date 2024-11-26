
interface Chip {
    label: string;
    color: boolean;
}

const Chip = ({ label, color }: Chip) => {
    return (
        <div
            className={`inline-flex items-center w-fit h-fit px-3 py-2 gap-2 rounded-[88px] border-[0.6px]`}
        >
            {color &&
                <span className={`w-2 h-2 rounded-full ${label == "open" ? "bg-[#00BA88]" : "bg-gray-400"}`} />
            }
            <span className="text-sm font-medium text-gray-800">{label}</span>
        </div>
    );
};

export default Chip;
