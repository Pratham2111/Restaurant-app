import { ABOUT_SECTION, RESTAURANT_INFO } from "@/lib/constants";

export const About = () => {
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center">
          <div className="md:w-1/2 mb-10 md:mb-0 md:pr-10">
            <h2 className="text-3xl md:text-4xl font-display font-bold text-neutral mb-6">
              {ABOUT_SECTION.heading.split(" ").map((word, idx) => (
                <span key={idx} className={idx === ABOUT_SECTION.heading.split(" ").length - 1 ? "text-primary" : ""}>
                  {word}{" "}
                </span>
              ))}
            </h2>
            
            {ABOUT_SECTION.description.map((paragraph, idx) => (
              <p key={idx} className="text-lg mb-6 leading-relaxed">
                {paragraph}
              </p>
            ))}
            
            <div className="flex flex-col sm:flex-row">
              <div className="mr-0 sm:mr-6 mb-4 sm:mb-0">
                <p className="text-sm uppercase tracking-widest mb-2">Opening Hours</p>
                <p className="font-medium">Mon-Fri: {RESTAURANT_INFO.hours.weekdays}</p>
                <p className="font-medium">Sat-Sun: {RESTAURANT_INFO.hours.weekends}</p>
              </div>
              <div>
                <p className="text-sm uppercase tracking-widest mb-2">Reservations</p>
                <p className="font-medium">{RESTAURANT_INFO.phone}</p>
                <p className="font-medium">{RESTAURANT_INFO.reservationEmail}</p>
              </div>
            </div>
          </div>
          
          <div className="md:w-1/2">
            <div className="grid grid-cols-2 gap-4">
              {ABOUT_SECTION.images.map((image, idx) => (
                <img 
                  key={idx}
                  src={image} 
                  alt={`Restaurant atmosphere ${idx + 1}`} 
                  className="rounded-lg shadow-md w-full h-56 object-cover"
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
