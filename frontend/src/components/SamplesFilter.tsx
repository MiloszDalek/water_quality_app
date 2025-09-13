const sampleTypes = ["all", "influent", "effluent", "sludge", "prediction"];

function SamplesFilter({ selectedType, setSelectedType }: { selectedType: string, setSelectedType: (type: string) => void }) {
  return (
    <div className="flex items-center gap-2 mb-0">
      <label htmlFor="sampleType" className="mb-0">Select type: </label>
      <select
        id="sampleType"
        value={selectedType}
        onChange={e => setSelectedType(e.target.value)}
        className="px-3 py-2 border rounded w-full cursor-pointer sm:w-40 text-sm bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
      >
        {sampleTypes.map(type => (
          <option key={type} value={type}>
            {type.charAt(0).toUpperCase() + type.slice(1)}
          </option>
        ))}
      </select>
    </div>
  );
}

export default SamplesFilter;
