
interface Chip {
    label: string;
    color: string;
}

const Chip = ({ label, color }: Chip) => {
    return (
        <div
            className={`inline-flex items-center w-fit h-fit px-3 py-2 gap-2 rounded-[88px] border-[0.6px]`}
        >
            {/* TODO */}
            {/* Dot color */}
            <span className="text-sm font-medium text-gray-800">{label}</span>
        </div>
    );
};

export default Chip;
