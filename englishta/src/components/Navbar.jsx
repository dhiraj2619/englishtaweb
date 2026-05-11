export default function Navbar() {
  return (
    <>
      <div className="histudy-offer-bar">
        <span className="histudy-offer-badge">Limited Time Offer</span>
        <p className="histudy-offer-text">
          <i className="fa-solid fa-hands-clapping" />
          Intro price. Get Englishta for Big Sale -95% off.
        </p>
        <a href="#" className="histudy-offer-link">
          Purchase Now <i className="fa-solid fa-arrow-right" />
        </a>
        <span className="histudy-offer-close" aria-hidden="true">
          &times;
        </span>
      </div>

      <div className="histudy-nav">
        <a href="/" className="histudy-brand" aria-label="Englishta home">
          <img src="/assets/images/logo/englishta.png" alt="Englishta Logo" />
        </a>
        <ul className="histudy-menu">
          <li>
            <a href="/">Home</a>
          </li>
          <li>
            <a href="/about">About Us</a>
          </li>
          <li>
            <a href="/courses">Courses</a>
          </li>
          <li>
            <a href="/webinar">Webinar</a>
          </li>
          <li>
            <a href="/contact">Contact Us</a>
          </li>
        </ul>
        <a href="/contact" className="histudy-purchase">
          Join Now
        </a>
      </div>
    </>
  );
}
