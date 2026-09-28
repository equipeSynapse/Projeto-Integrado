import React, { useState } from 'react';

function IconX({ className = "w-5 h-5" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="6" x2="6" y2="18"></line>
      <line x1="6" y1="6" x2="18" y2="18"></line>
    </svg>
  );
}

function IconEye({ className = "w-5 h-5" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0"/>
      <circle cx="12" cy="12" r="3"/>
    </svg>
  );
}

function IconEyeClosed({ className = "w-5 h-5" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m15 18-.722-3.25"/>
      <path d="M2 8a10.645 10.645 0 0 0 20 0"/>
      <path d="m20 15-1.726-2.05"/>
      <path d="m4 15 1.726-2.05"/>
      <path d="m9 18 .722-3.25"/>
    </svg>
  );
}

function IconInfo({ className = "w-5 h-5" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/>
      <path d="M12 16v-4"/>
      <path d="M12 8h.01"/>
    </svg>
  );
}

export default function LoginModal() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({ email: '', password: '' });
  const [isOpen, setIsOpen] = useState(true);

  const handleSubmit = (e) => {
    e?.preventDefault();
    const newErrors = { email: '', password: '' };

    if (!email.trim()) {
      newErrors.email = 'Preencha este campo';
    }
    if (!password.trim()) {
      newErrors.password = 'Preencha este campo';
    }

    setErrors(newErrors);

    if (!newErrors.email && !newErrors.password) {
      if (!email.endsWith('@alu.ufc.br') && !email.endsWith('@ufc.br') && !email.endsWith('@virtual.ufc.br')) {
        setErrors({
          email: 'E-mail ou senha incorreta',
          password: 'E-mail ou senha incorreta',
        });
      } else {
        console.log('Login efetuado com sucesso:', { email, password });
      }
    }
  };

  const simulateEmptyErrors = () => {
    setEmail('');
    setPassword('');
    setErrors({
      email: 'Preencha este campo',
      password: 'Preencha este campo',
    });
  };

  const simulateInvalidCredentials = () => {
    setEmail('Amanda.rules@alu.ufc.br');
    setPassword('Senha12#');
    setErrors({
      email: 'E-mail ou senha incorreta',
      password: 'E-mail ou senha incorreta',
    });
  };

  const simulateSuccessState = () => {
    setEmail('Amanda.rules@alu.ufc.br');
    setPassword('Senha12#');
    setErrors({ email: '', password: '' });
  };

  const resetForm = () => {
    setEmail('');
    setPassword('');
    setErrors({ email: '', password: '' });
  };

  const isFormFilled = email.trim() !== '' && password.trim() !== '';

  return (
    <div className="min-h-screen bg-[#eaedf0] flex flex-col items-center justify-center p-4 text-[#2b2f33]">

      {isOpen ? (
        <section
          role="dialog"
          aria-modal="true"
          className="w-full max-w-[480px] bg-white rounded-[24px] sm:rounded-[28px] shadow-[0_15px_40px_rgba(0,0,0,0.06)] border border-[#e8ecef] p-8 sm:p-10 relative transition-all"
        >
          <button
            type="button"
            onClick={() => setIsOpen(false)}
            aria-label="Fechar modal"
            className="absolute top-6 right-6 text-[#202428] hover:text-black transition p-1 rounded-full hover:bg-gray-100 cursor-pointer"
          >
            <IconX className="w-5 h-5 stroke-[2.5]" />
          </button>

          <header className="text-center mt-2 mb-8">
            <h1 className="text-[28px] sm:text-[32px] font-bold tracking-tight text-[#1a1d20] mb-2.5">
              Boas-vindas
            </h1>
            <p className="text-[14.5px] leading-relaxed text-[#4b5259] max-w-[340px] mx-auto">
              Use seu e-mail institucional para entrar no Mural Colaborativo SMD.
            </p>
          </header>

          <form onSubmit={handleSubmit} noValidate className="space-y-4">
            <div>
              <label className="block text-[13.5px] font-medium text-[#1e2226] mb-1.5">
                E-mail institucional *
              </label>
              <div className="relative">
                <input
                  type="email"
                  placeholder="E-mail institucional"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (errors.email) setErrors((prev) => ({ ...prev, email: '' }));
                  }}
                  className={`w-full px-4 py-3 rounded-[10px] text-[14px] text-[#22262a] placeholder-[#9ca3af] outline-none transition border ${
                    errors.email
                      ? 'border-[#ef4444] focus:border-[#ef4444] pr-10'
                      : 'border-[#d6dbe0] focus:border-[#4b5259]'
                  }`}
                />
                {errors.email && (
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 text-[#ef4444] pointer-events-none">
                    <IconInfo className="w-5 h-5" />
                  </div>
                )}
              </div>
              {errors.email && (
                <p className="mt-1.5 text-[12.5px] text-[#ef4444] font-normal">
                  {errors.email}
                </p>
              )}
            </div>

            <div>
              <label className="block text-[13.5px] font-medium text-[#1e2226] mb-1.5">
                Senha *
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Senha"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (errors.password) setErrors((prev) => ({ ...prev, password: '' }));
                  }}
                  className={`w-full px-4 py-3 rounded-[10px] text-[14px] text-[#22262a] placeholder-[#9ca3af] outline-none transition border ${
                    errors.password
                      ? 'border-[#ef4444] focus:border-[#ef4444] pr-10'
                      : 'border-[#d6dbe0] focus:border-[#4b5259]'
                  }`}
                />

                {errors.password ? (
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 text-[#ef4444] pointer-events-none">
                    <IconInfo className="w-5 h-5" />
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    tabIndex={-1}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#6b7280] hover:text-[#22262a] transition focus:outline-none cursor-pointer"
                    aria-label={showPassword ? 'Ocultar senha' : 'Exibir senha'}
                  >
                    {showPassword ? (
                      <IconEye className="w-5 h-5 stroke-[1.8]" />
                    ) : (
                      <IconEyeClosed className="w-5 h-5 stroke-[1.8]" />
                    )}
                  </button>
                )}
              </div>

              {errors.password && (
                <p className="mt-1.5 text-[12.5px] text-[#ef4444] font-normal">
                  {errors.password}
                </p>
              )}
            </div>

            <div className="flex justify-end pt-0.5">
              <a
                href="#recuperar-senha"
                className="text-[13px] font-semibold text-[#1e2226] hover:underline cursor-pointer"
              >
                Esqueceu sua senha?
              </a>
            </div>

            <div className="pt-4">
              <button
                type="submit"
                className={`w-full py-3.5 px-4 rounded-[8px] text-[14.5px] font-semibold transition duration-150 ease-in-out cursor-pointer ${
                  isFormFilled
                    ? 'bg-[#373c41] text-white hover:bg-[#25292c] active:scale-[0.99]'
                    : 'bg-[#9ba1a6] text-white hover:bg-[#8d9398]'
                }`}
              >
                Entrar
              </button>
            </div>

            <p className="text-center text-[13.5px] text-[#2a2f34] pt-2">
              Precisando de uma conta?{' '}
              <a
                href="#registro"
                className="font-bold text-[#1a1d20] hover:underline cursor-pointer"
              >
                Registre-se
              </a>
            </p>
          </form>
        </section>
      ) : (
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="px-6 py-3 bg-[#373c41] text-white text-sm font-semibold rounded-lg shadow-sm hover:bg-[#25292c] transition cursor-pointer"
        >
          Reabrir Modal de Boas-vindas
        </button>
      )}
    </div>
  );
}