"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

const navbarHtml = `<header class="td_site_header td_style_1 td_type_3 td_sticky_header td_medium">
      <div class="td_main_header">
        <div class="container-fluid">
          <div class="td_main_header_in">
            <div class="td_main_header_left">
              <a class="td_site_branding" href="index.html">
                <img src="/assets/images/logo/logoenglishta.png" style="height:80px" alt="Logo">
              </a>
              <a class="englishtaNavbar__leftLogo" href="/">
                <img src="/assets/images/logo/logoenglishta.png" alt="Englishta">
              </a>
            </div>
            <div class="td_main_header_center">
              <nav class="td_nav">
                <div class="td_nav_list_wrap">
                  <div class="td_nav_list_wrap_in">
                    <ul class="td_nav_list">
                      <li><a href="/">Home</a></li>
                      <li><a href="/courses">Courses</a></li>
                    </ul>
                 
                    <ul class="td_nav_list">
                      <li><a href="/webinar">Webinar</a></li>
                      <li><a href="/about-us">About</a></li>
                      <li><a href="/contact-us">Contact Us</a></li>
                     
                    </ul>
                  </div>
                </div>
              </nav>
            </div>
            <div class="td_main_header_right">
              <div class="position-relative">
                <button class="td_circle_btn td_center td_search_tobble_btn" type="button">
                                                
                </button>
                <div class="td_header_search_wrap">
                  <form action="#" class="td_header_search">
                    <input type="text" class="td_header_search_input" placeholder="Search For Anything">
                    <button class="td_header_search_btn td_center">
                      <img src="https://picsum.photos/seed/englishta-103/900/600" alt="">
                    </button>
                  </form>
                </div>
              </div>
              <div class="englishtaNavbarAuthSlot" data-navbar-auth-slot></div>
              <button class="td_hamburger_btn"></button>
            </div>
          </div>
        </div>
      </div>
    </header>
    <div class="td_side_header">
      <button class="td_close"></button>
      <div class="td_side_header_overlay"></div>
      <div class="td_side_header_in">
        <div class="td_side_header_shape"></div>
        <a class="td_site_branding" href="index.html">
          <img src="https://picsum.photos/seed/englishta-104/900/600" alt="Logo">
        </a>
        <div class="td_side_header_box">
          <h2 class="td_side_header_heading">Want to improve your English? <br> Join our online speaking classes.</h2>
        </div>
        <div class="td_side_header_box">
          <h3 class="td_side_header_title td_heading_color">Contact Us</h3>
          <ul class="td_side_header_contact_info td_mp_0">
            <li>
              <i class="fa-solid fa-envelope"></i>             
              <span><a href="mailto:speak@englishta4u.com">speak@englishta4u.com</a></span>
            </li>
          </ul>
        </div>
        <div class="td_side_header_box">
          <h3 class="td_side_header_title td_heading_color">Get Updates</h3>
          <div class="td_newsletter td_style_1">
            <form action="#" class="td_newsletter_form">
              <input type="email" class="td_newsletter_input" placeholder="Your email address">
              <button type="submit" class="td_btn td_style_1 td_radius_30 td_medium">
                <span class="td_btn_in td_white_color td_accent_bg">
                  <span>Get Updates Now</span>
                </span>             
              </button>
            </form>
          </div>
        </div>
        <div class="td_side_header_box">
          <h3 class="td_side_header_title td_heading_color">Follow Us</h3>
          <div class="td_social_btns td_style_1 td_heading_color">
            <a href="#" class="td_center">
              <i class="fa-brands fa-instagram"></i>
            </a>
            <a href="#" class="td_center">
              <i class="fa-brands fa-facebook-f"></i>
            </a>
            <a href="#" class="td_center">
              <i class="fa-brands fa-whatsapp"></i>
            </a>
            <a href="#" class="td_center">
              <i class="fa-brands fa-youtube"></i>
            </a>
            <a href="#" class="td_center">
              <i class="fa-brands fa-pinterest-p"></i>
            </a>
          </div>
        </div>
      </div>
    </div>`;

export default function Navbar() {
  const [hasScrolledPastThreshold, setHasScrolledPastThreshold] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [navbarAuthSlot, setNavbarAuthSlot] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [isAuthChecking, setIsAuthChecking] = useState(true);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [authStep, setAuthStep] = useState(1);
  const [authEmail, setAuthEmail] = useState("");
  const [authPassword, setAuthPassword] = useState("");
  const [authFullName, setAuthFullName] = useState("");
  const [authPhone, setAuthPhone] = useState("");
  const [authConfirmPassword, setAuthConfirmPassword] = useState("");
  const [authError, setAuthError] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [authMode, setAuthMode] = useState("login");
  const [showAuthPassword, setShowAuthPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isCredentialLoading, setIsCredentialLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const googleCodeClientRef = useRef(null);
  const [authToast, setAuthToast] = useState(null);
  const [pendingAuthRedirect, setPendingAuthRedirect] = useState("");
  const [isAuthCardFlipping, setIsAuthCardFlipping] = useState(false);
  const [isAuthCardSettled, setIsAuthCardSettled] = useState(false);
  const authTransitionTimeoutRef = useRef(null);
  const authFlipResetTimeoutRef = useRef(null);
  const authOpenAnimationTimeoutRef = useRef(null);
  const authToastTimeoutRef = useRef(null);
  const profileMenuRef = useRef(null);

  const openAuthModal = (redirectTo = "") => {
    setAuthStep(1);
    setAuthError("");
    setPendingAuthRedirect(redirectTo);
    setIsAuthCardFlipping(false);
    setIsAuthCardSettled(false);
    setIsAuthModalOpen(true);
  };

  const completeAuthFlow = (user) => {
    setCurrentUser(user || null);

    if (pendingAuthRedirect) {
      window.location.assign(pendingAuthRedirect);
      return;
    }

    closeAuthModal();
  };

  useEffect(() => {
    const handleScroll = () => {
      setHasScrolledPastThreshold(window.scrollY > 700);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const frameId = window.requestAnimationFrame(() => {
      setNavbarAuthSlot(document.querySelector("[data-navbar-auth-slot]"));
    });

    return () => {
      window.cancelAnimationFrame(frameId);
    };
  }, [hasScrolledPastThreshold]);

  useEffect(() => {
    fetch("/api/auth/me", { cache: "no-store" })
      .then(async (response) => {
        if (!response.ok) return null;
        const payload = await response.json();
        return payload?.user || null;
      })
      .then((user) => {
        setCurrentUser(user);
      })
      .catch(() => {
        setCurrentUser(null);
      })
      .finally(() => {
        setIsAuthChecking(false);
      });
  }, []);

  useEffect(() => {
    const handleProtectedNavigation = (event) => {
      const redirectTo = event.detail?.href || "/student-profile";

      if (isAuthChecking) {
        window.setTimeout(() => {
          window.dispatchEvent(
            new CustomEvent("englishta:protected-navigation", {
              detail: { href: redirectTo },
            }),
          );
        }, 120);
        return;
      }

      if (currentUser) {
        window.location.assign(redirectTo);
        return;
      }

      openAuthModal(redirectTo);
    };

    window.addEventListener("englishta:protected-navigation", handleProtectedNavigation);

    return () => {
      window.removeEventListener("englishta:protected-navigation", handleProtectedNavigation);
    };
  }, [currentUser, isAuthChecking]);

  useEffect(() => {
    if (!isAuthModalOpen) return undefined;

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        setIsAuthModalOpen(false);
      }
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);
    authOpenAnimationTimeoutRef.current = setTimeout(() => {
      setIsAuthCardSettled(true);
    }, 620);

    return () => {
      if (authOpenAnimationTimeoutRef.current) {
        clearTimeout(authOpenAnimationTimeoutRef.current);
      }

      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isAuthModalOpen]);

  useEffect(() => {
    if (!isProfileMenuOpen) return undefined;

    const handleDocumentClick = (event) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target)) {
        setIsProfileMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleDocumentClick);

    return () => {
      document.removeEventListener("mousedown", handleDocumentClick);
    };
  }, [isProfileMenuOpen]);

  useEffect(() => {
    return () => {
      if (authTransitionTimeoutRef.current) {
        clearTimeout(authTransitionTimeoutRef.current);
      }

      if (authFlipResetTimeoutRef.current) {
        clearTimeout(authFlipResetTimeoutRef.current);
      }

      if (authOpenAnimationTimeoutRef.current) {
        clearTimeout(authOpenAnimationTimeoutRef.current);
      }

      if (authToastTimeoutRef.current) {
        clearTimeout(authToastTimeoutRef.current);
      }
    };
  }, []);

  const closeAuthModal = () => {
    if (authTransitionTimeoutRef.current) {
      clearTimeout(authTransitionTimeoutRef.current);
    }

    if (authFlipResetTimeoutRef.current) {
      clearTimeout(authFlipResetTimeoutRef.current);
    }

    setIsAuthModalOpen(false);
    setAuthError("");
    setPendingAuthRedirect("");
    setIsAuthCardFlipping(false);
    setIsAuthCardSettled(false);
  };

  const resetRegisterFields = () => {
    setAuthFullName("");
    setAuthPhone("");
    setAuthConfirmPassword("");
    setShowAuthPassword(false);
    setShowConfirmPassword(false);
  };

  const showAuthToast = (message, type = "success") => {
    setAuthToast({ message, type });

    if (authToastTimeoutRef.current) {
      clearTimeout(authToastTimeoutRef.current);
    }

    authToastTimeoutRef.current = setTimeout(() => {
      setAuthToast(null);
    }, 4200);
  };

  const switchToLoginAfterRegister = (message) => {
    const registeredEmail = authEmail.trim();

    showAuthToast(message || "Account created successfully. Please login to continue.");
    setIsAuthCardFlipping(true);

    if (authTransitionTimeoutRef.current) {
      clearTimeout(authTransitionTimeoutRef.current);
    }

    if (authFlipResetTimeoutRef.current) {
      clearTimeout(authFlipResetTimeoutRef.current);
    }

    authTransitionTimeoutRef.current = setTimeout(() => {
      setAuthMode("login");
      setAuthStep(1);
      setAuthEmail(registeredEmail);
      setAuthPassword("");
      resetRegisterFields();
      setAuthError("");
    }, 320);

    authFlipResetTimeoutRef.current = setTimeout(() => {
      setIsAuthCardFlipping(false);
    }, 720);
  };

  const handleEmailContinue = (event) => {
    event.preventDefault();
    const normalizedEmail = authEmail.trim();

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
      setAuthError("Please enter a valid email address.");
      return;
    }

    setIsCredentialLoading(true);
    fetch("/api/auth/check-email", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email: normalizedEmail }),
    })
      .then(async (response) => {
        const payload = await response.json();
        if (!response.ok) throw new Error(payload.message || "Unable to continue.");
        return payload;
      })
      .then((payload) => {
        setAuthEmail(normalizedEmail);
        setAuthMode(payload.exists ? "login" : "register");
        setAuthPassword("");
        setShowAuthPassword(false);
        resetRegisterFields();
        setAuthError("");
        setAuthStep(2);
      })
      .catch((error) => {
        setAuthError(error.message || "Unable to continue.");
      })
      .finally(() => setIsCredentialLoading(false));
  };

  const handlePasswordSubmit = (event) => {
    event.preventDefault();

    if (authMode === "register") {
      if (authFullName.trim().length < 2) {
        setAuthError("Please enter your full name.");
        return;
      }

      if (!/^[0-9+\-\s()]{7,18}$/.test(authPhone.trim())) {
        setAuthError("Please enter a valid phone number.");
        return;
      }
    }

    if (!authPassword.trim()) {
      setAuthError("Please enter your password.");
      return;
    }

    if (authMode === "register" && authPassword !== authConfirmPassword) {
      setAuthError("Password and confirm password do not match.");
      return;
    }

    setIsCredentialLoading(true);
    fetch(authMode === "register" ? "/api/auth/register" : "/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: authEmail,
        name: authFullName,
        phone: authPhone,
        password: authPassword,
      }),
    })
      .then(async (response) => {
        const payload = await response.json();
        if (!response.ok) {
          const authFailure = new Error(payload.message || "Authentication failed.");
          authFailure.payload = payload;
          throw authFailure;
        }
        return payload;
      })
      .then((payload) => {
        setAuthError("");
        if (authMode === "register") {
          switchToLoginAfterRegister(payload.message);
          return;
        }

        completeAuthFlow(payload.user || null);
      })
      .catch((error) => {
        setAuthError(error.message || "Authentication failed.");
      })
      .finally(() => setIsCredentialLoading(false));
  };

  const handleGoogleLogin = () => {
    const googleClientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;

    if (!googleClientId) {
      setAuthError("Google login is not configured yet.");
      return;
    }

    setIsGoogleLoading(true);

    const submitGoogleCode = (code) => {
      fetch("/api/auth/google", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Requested-With": "XmlHttpRequest",
        },
        body: JSON.stringify({ code }),
      })
        .then(async (response) => {
          const payload = await response.json();
          if (!response.ok) throw new Error(payload.message || "Google login failed.");
          return payload;
        })
        .then((payload) => {
          setAuthError("");
          completeAuthFlow(payload.user || null);
        })
        .catch((error) => {
          setAuthError(error.message || "Google login failed.");
        })
        .finally(() => setIsGoogleLoading(false));
    };

    const initializeGoogle = () => {
      if (!window.google?.accounts?.oauth2) {
        setAuthError("Unable to load Google login.");
        setIsGoogleLoading(false);
        return;
      }

      if (!googleCodeClientRef.current) {
        googleCodeClientRef.current = window.google.accounts.oauth2.initCodeClient({
          client_id: googleClientId,
          scope: "openid email profile",
          ux_mode: "popup",
          callback: (response) => {
            if (!response?.code) {
              setAuthError("Google login was cancelled.");
              setIsGoogleLoading(false);
              return;
            }

            submitGoogleCode(response.code);
          },
          error_callback: (error) => {
            if (error?.type !== "popup_closed") {
              setAuthError("Google login failed.");
            }

            setIsGoogleLoading(false);
          },
        });
      }

      googleCodeClientRef.current.requestCode();
    };

    if (window.google?.accounts?.oauth2) {
      initializeGoogle();
      return;
    }

    const script = document.createElement("script");
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.defer = true;
    script.onload = initializeGoogle;
    script.onerror = () => {
      setAuthError("Unable to load Google login.");
      setIsGoogleLoading(false);
    };
    document.head.appendChild(script);
  };

  const renderNavbarAuth = () => {
    const handleLogout = () => {
      fetch("/api/auth/logout", { method: "POST" })
        .finally(() => {
          setCurrentUser(null);
          setIsProfileMenuOpen(false);
        });
    };

    if (isAuthChecking) {
      return (
        <div className="englishtaNavbarAuthSkeleton" aria-label="Checking login status">
          <span />
        </div>
      );
    }

    if (currentUser) {
      const userInitial = (currentUser.name || currentUser.email || "S").trim().charAt(0).toUpperCase();

      return (
        <div className="englishtaNavbarProfile" ref={profileMenuRef}>
          <button
            aria-expanded={isProfileMenuOpen}
            aria-haspopup="menu"
            className="englishtaNavbarProfile__button"
            type="button"
            onClick={() => setIsProfileMenuOpen((current) => !current)}
          >
            <span>{userInitial}</span>
            <i className="fa-solid fa-chevron-down" aria-hidden="true" />
          </button>

          {isProfileMenuOpen ? (
            <div className="englishtaNavbarProfile__dropdown" role="menu">
              <div className="englishtaNavbarProfile__head">
                <strong>{currentUser.name || "Student"}</strong>
                <span>{currentUser.email}</span>
              </div>
              <a href="/joined-courses" role="menuitem">
                <i className="fa-solid fa-book-open" aria-hidden="true" />
                Joined Courses
              </a>
              <a href="/student-profile" role="menuitem">
                <i className="fa-regular fa-user" aria-hidden="true" />
                Student Profile
              </a>
              <a href="/my-progress" role="menuitem">
                <i className="fa-solid fa-chart-line" aria-hidden="true" />
                My Progress
              </a>
              <button type="button" role="menuitem" onClick={handleLogout}>
                <i className="fa-solid fa-arrow-right-from-bracket" aria-hidden="true" />
                Logout
              </button>
            </div>
          ) : null}
        </div>
      );
    }

    return (
      <button className="englishtaNavbarLoginButton" type="button" onClick={() => openAuthModal()}>
        Login / Register
      </button>
    );
  };

  return (
    <>
      <div
        className={hasScrolledPastThreshold ? "englishtaNavbar englishtaNavbar--scrolled" : "englishtaNavbar"}
        dangerouslySetInnerHTML={{ __html: navbarHtml }}
      />

      {navbarAuthSlot ? createPortal(renderNavbarAuth(), navbarAuthSlot) : null}

      {authToast ? (
        <div className={`englishtaAuthToast englishtaAuthToast--${authToast.type}`} role="status" aria-live="polite">
          <span>
            <i className="fa-solid fa-check" aria-hidden="true" />
          </span>
          <p>{authToast.message}</p>
        </div>
      ) : null}

      {isAuthModalOpen ? (
        <div className="englishtaAuthModal" role="presentation" onMouseDown={closeAuthModal}>
          <section
            aria-labelledby="englishta-auth-title"
            aria-modal="true"
            className={
              authStep === 2 && authMode === "register"
                ? `englishtaAuthModal__card englishtaAuthModal__card--register${isAuthCardSettled ? " englishtaAuthModal__card--settled" : ""}${isAuthCardFlipping ? " englishtaAuthModal__card--flipRight" : ""}`
                : `englishtaAuthModal__card${isAuthCardSettled ? " englishtaAuthModal__card--settled" : ""}${isAuthCardFlipping ? " englishtaAuthModal__card--flipRight" : ""}`
            }
            role="dialog"
            onMouseDown={(event) => event.stopPropagation()}
          >
            <button
              aria-label="Close login and register popup"
              className="englishtaAuthModal__close"
              type="button"
              onClick={closeAuthModal}
            >
              <span />
              <span />
            </button>

            {authStep >= 2 ? (
              <button
                aria-label="Back to email step"
                className="englishtaAuthModal__back"
                type="button"
                onClick={() => {
                  setAuthStep(1);
                  setAuthError("");
                  setShowAuthPassword(false);
                  setShowConfirmPassword(false);
                }}
              >
                <i className="fa-solid fa-arrow-left" aria-hidden="true" />
              </button>
            ) : null}

            <div className="englishtaAuthModal__brand">
              <div className="englishtaAuthModal__sparkles" aria-hidden="true">
                <span />
                <span />
                <span />
                <span />
                <span />
                <span />
              </div>
              <img src="/assets/images/tukoauth.png" alt="Englishta mascot" />
            </div>

            {authStep === 1 ? (
              <form className="englishtaAuthModal__form" onSubmit={handleEmailContinue}>
                <h3 id="englishta-auth-title">Sign in with your email to continue</h3>


                <label className="englishtaAuthModal__field">
                  <span>Email Address</span>
                  <div className="englishtaAuthModal__inputWrap">
                    <i className="fa-regular fa-envelope" aria-hidden="true" />
                    <input
                      type="email"
                      placeholder="Enter your email address"
                      aria-label="Email address"
                      aria-invalid={authError ? "true" : "false"}
                      value={authEmail}
                      onChange={(event) => {
                        setAuthEmail(event.target.value);
                        if (authError) setAuthError("");
                      }}
                    />
                  </div>
                </label>
                {authError ? <p className="englishtaAuthModal__error">{authError}</p> : null}

                <button className="englishtaAuthModal__submit" type="submit" disabled={isCredentialLoading}>
                  {isCredentialLoading ? "Please wait..." : "Continue"}
                </button>
              </form>
            ) : authStep === 2 ? (
              <form className="englishtaAuthModal__form" onSubmit={handlePasswordSubmit}>
                <h3 id="englishta-auth-title">
                  {authMode === "register" ? "Create your Englishta account" : "Welcome back!"}
                </h3>
                <p>
                  {authMode === "register"
                    ? "Add a few details before continuing"
                    : "Enter your password to continue"}
                </p>

                <label className="englishtaAuthModal__field">
                  <span>Email Address</span>
                  <div className="englishtaAuthModal__inputWrap englishtaAuthModal__emailPreview">
                    <i className="fa-regular fa-envelope" aria-hidden="true" />
                    <strong>{authEmail || "john.doe@example.com"}</strong>
                    <button
                      type="button"
                      onClick={() => {
                        setAuthStep(1);
                        setAuthError("");
                        setShowAuthPassword(false);
                        setShowConfirmPassword(false);
                      }}
                    >
                      Change
                    </button>
                  </div>
                </label>

                {authMode === "register" ? (
                  <>
                    <label className="englishtaAuthModal__field">
                      <span>Full Name</span>
                      <div className="englishtaAuthModal__inputWrap">
                        <i className="fa-regular fa-user" aria-hidden="true" />
                        <input
                          type="text"
                          placeholder="Enter your full name"
                          aria-label="Full name"
                          value={authFullName}
                          onChange={(event) => {
                            setAuthFullName(event.target.value);
                            if (authError) setAuthError("");
                          }}
                        />
                      </div>
                    </label>

                    <label className="englishtaAuthModal__field">
                      <span>Phone Number</span>
                      <div className="englishtaAuthModal__inputWrap">
                        <i className="fa-solid fa-phone" aria-hidden="true" />
                        <input
                          type="tel"
                          placeholder="Enter your phone number"
                          aria-label="Phone number"
                          value={authPhone}
                          onChange={(event) => {
                            setAuthPhone(event.target.value);
                            if (authError) setAuthError("");
                          }}
                        />
                      </div>
                    </label>
                  </>
                ) : null}

                {authMode === "register" ? (
                  <div className="englishtaAuthModal__passwordGrid">
                    <label className="englishtaAuthModal__field">
                      <span>Choose Password</span>
                      <div className="englishtaAuthModal__inputWrap">
                        <i className="fa-solid fa-lock" aria-hidden="true" />
                        <input
                          type={showAuthPassword ? "text" : "password"}
                          placeholder="Choose password"
                          aria-label="Choose password"
                          aria-invalid={authError ? "true" : "false"}
                          value={authPassword}
                          onChange={(event) => {
                            setAuthPassword(event.target.value);
                            if (authError) setAuthError("");
                          }}
                        />
                        <button
                          aria-label={showAuthPassword ? "Hide password" : "Show password"}
                          className="englishtaAuthModal__passwordToggle"
                          type="button"
                          onClick={() => setShowAuthPassword((current) => !current)}
                        >
                          <i className={showAuthPassword ? "fa-regular fa-eye" : "fa-regular fa-eye-slash"} aria-hidden="true" />
                        </button>
                      </div>
                    </label>

                    <label className="englishtaAuthModal__field">
                      <span>Confirm Password</span>
                      <div className="englishtaAuthModal__inputWrap">
                        <i className="fa-solid fa-lock" aria-hidden="true" />
                        <input
                          type={showConfirmPassword ? "text" : "password"}
                          placeholder="Confirm password"
                          aria-label="Confirm password"
                          aria-invalid={authError ? "true" : "false"}
                          value={authConfirmPassword}
                          onChange={(event) => {
                            setAuthConfirmPassword(event.target.value);
                            if (authError) setAuthError("");
                          }}
                        />
                        <button
                          aria-label={showConfirmPassword ? "Hide confirm password" : "Show confirm password"}
                          className="englishtaAuthModal__passwordToggle"
                          type="button"
                          onClick={() => setShowConfirmPassword((current) => !current)}
                        >
                          <i className={showConfirmPassword ? "fa-regular fa-eye" : "fa-regular fa-eye-slash"} aria-hidden="true" />
                        </button>
                      </div>
                    </label>
                  </div>
                ) : (
                  <label className="englishtaAuthModal__field">
                    <span>Password</span>
                    <div className="englishtaAuthModal__inputWrap">
                      <i className="fa-solid fa-lock" aria-hidden="true" />
                      <input
                        type={showAuthPassword ? "text" : "password"}
                        placeholder="Enter your password"
                        aria-label="Password"
                        aria-invalid={authError ? "true" : "false"}
                        value={authPassword}
                        onChange={(event) => {
                          setAuthPassword(event.target.value);
                          if (authError) setAuthError("");
                        }}
                      />
                      <button
                        aria-label={showAuthPassword ? "Hide password" : "Show password"}
                        className="englishtaAuthModal__passwordToggle"
                        type="button"
                        onClick={() => setShowAuthPassword((current) => !current)}
                      >
                        <i className={showAuthPassword ? "fa-regular fa-eye" : "fa-regular fa-eye-slash"} aria-hidden="true" />
                      </button>
                    </div>
                  </label>
                )}
                {authError ? <p className="englishtaAuthModal__error">{authError}</p> : null}

                {authMode === "login" ? (
                  <div className="englishtaAuthModal__options">
                    <label>
                      <input
                        type="checkbox"
                        checked={rememberMe}
                        onChange={(event) => setRememberMe(event.target.checked)}
                      />
                      Remember me
                    </label>
                    <a href="/forgot-password">Forgot Password?</a>
                  </div>
                ) : null}

                <button className="englishtaAuthModal__submit" type="submit" disabled={isCredentialLoading}>
                  {isCredentialLoading ? "Please wait..." : authMode === "register" ? "Sign Up" : "Sign In"}
                </button>
              </form>
            ) : null}

            <div className="englishtaAuthModal__divider">
              <span />
              <em>OR</em>
              <span />
            </div>

            <button className="englishtaAuthModal__google" type="button" onClick={handleGoogleLogin} disabled={isGoogleLoading}>
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path fill="#4285F4" d="M21.6 12.2c0-.7-.1-1.3-.2-1.9H12v3.6h5.4c-.2 1.2-.9 2.2-1.9 2.9v2.4h3.1c1.8-1.7 3-4.1 3-7Z" />
                <path fill="#34A853" d="M12 22c2.6 0 4.8-.9 6.4-2.3l-3.1-2.4c-.9.6-2 .9-3.3.9-2.5 0-4.7-1.7-5.4-4H3.4v2.5C5 19.8 8.2 22 12 22Z" />
                <path fill="#FBBC05" d="M6.6 14.2c-.2-.6-.3-1.3-.3-2s.1-1.4.3-2V7.7H3.4C2.8 9 2.4 10.4 2.4 12s.4 3 1 4.3l3.2-2.1Z" />
                <path fill="#EA4335" d="M12 5.8c1.4 0 2.7.5 3.7 1.5l2.8-2.8C16.8 2.9 14.6 2 12 2 8.2 2 5 4.2 3.4 7.7l3.2 2.5c.7-2.4 2.9-4.4 5.4-4.4Z" />
              </svg>
              {isGoogleLoading ? "Please wait..." : "Sign in with Google"}
            </button>


          </section>
        </div>
      ) : null}
    </>
  );
}
