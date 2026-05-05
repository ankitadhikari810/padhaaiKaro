function FormInput({
  name,
  value,
  onChange,
  type = 'text',
  placeholder,
  required = true,
  min,
  max,
}) {
  return (
    <input
      required={required}
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      min={min}
      max={max}
      className="w-full rounded-lg border border-rose-200 bg-white px-3 py-2 text-slate-700 outline-none ring-fuchsia-300/60 placeholder:text-slate-400 focus:ring"
    />
  )
}

export default FormInput
