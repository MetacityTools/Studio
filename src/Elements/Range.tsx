export function Range(props: {
    value: number;
    min: number;
    max: number;
    onChange: (value: number) => void;
}) {
    const { value, min, max, onChange } = props;

    const updateValue = (e: React.ChangeEvent<HTMLInputElement>) => {
        const i = parseFloat(e.target.value);
        if (isNaN(i)) return;
        else onChange(i);
    };

    return (
        <input
            type="range"
            className="w-full"
            min={min}
            max={max}
            value={value}
            step={0.5}
            onChange={updateValue}
        />
    );
}
