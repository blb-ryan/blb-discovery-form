export default function Header({ minimal }) {
  return (
    <header className={`header ${minimal ? 'header-minimal' : ''}`}>
      <a href={`${import.meta.env.BASE_URL}#/`} className="header-logo-link">
        <img
          src={`${import.meta.env.BASE_URL}blb-logo-white.svg`}
          alt="Brave Little Beast"
          className="header-logo"
        />
      </a>

      <style>{`
        .header {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          z-index: calc(var(--z-progress) + 1);
          display: flex;
          align-items: center;
          padding: var(--space-md) var(--space-lg);
          pointer-events: none;
        }

        .header-minimal {
          padding: var(--space-sm) var(--space-lg);
        }

        .header-logo-link {
          pointer-events: auto;
          display: inline-flex;
          transition: opacity var(--transition-fast);
        }

        .header-logo-link:hover {
          opacity: 0.8;
        }

        .header-logo {
          height: 28px;
          width: auto;
          opacity: 1;
          transition: opacity var(--transition-fast);
        }

        .header-logo-link:hover .header-logo {
          opacity: 0.8;
        }

        .header-minimal .header-logo {
          height: 22px;
          opacity: 0.7;
        }

        @media (max-width: 600px) {
          .header {
            padding: var(--space-sm) var(--space-md);
          }

          .header-logo {
            height: 22px;
          }

          .header-minimal .header-logo {
            height: 18px;
          }
        }
      `}</style>
    </header>
  );
}
