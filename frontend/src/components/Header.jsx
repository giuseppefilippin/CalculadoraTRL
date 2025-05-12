export default function Header() {
  return (
    <header className="header">
      <img src="/imgs/LACTEClogo.jpg" alt="Logo LACTEC" />
      <h1>
        <a href="/" style={{ textDecoration: "none", color: "inherit" }}>
          Calculadora TRL
        </a>
      </h1>
      <img
        id="fundacaoAraucariaLogo"
        src="/imgs/fundacaoARAUCARIA.png"
        alt="Logo Fundação Araucária"
      />
    </header>
  );
}

