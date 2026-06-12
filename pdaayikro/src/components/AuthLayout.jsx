function AuthLayout({ title, subtitle, children }) {
  return (
    <div className="grid min-h-[calc(100vh-5rem)] place-items-center py-8">
      <section className="w-full max-w-md rounded-2xl border border-rose-200 bg-white/90 p-6 shadow-sm md:p-8">
        <div className="flex flex-col items-center text-center">
          <div className="mb-4 flex items-center justify-center">
            <img
              src="/auth-logo.jpeg"
              alt="padhaiKaro logo"
              className="h-28 w-auto object-contain md:h-32"
            />
          </div>
          <h1 className="text-3xl font-bold text-slate-800 md:text-4xl">{title}</h1>
          <p className="mt-2 text-sm text-slate-600">{subtitle}</p>
        </div>

        <div className="mt-6">{children}</div>
      </section>
    </div>
  )
}

export default AuthLayout
