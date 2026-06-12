function FormInput({
  name,
  value,
  onChange,
  type = 'text',
  placeholder,
  required = true,
  min,
  max,
  step,
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
      step={step}
      className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none placeholder:text-slate-400 focus:border-blue-500 focus:ring focus:ring-blue-500/30"
    />
  )
}

export default FormInput
