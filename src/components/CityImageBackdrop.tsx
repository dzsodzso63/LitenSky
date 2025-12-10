type CityImageBackdropProps = {
  cityImage: string | null;
};

const CityImageBackdrop = ({ cityImage }: CityImageBackdropProps) => {
  if (!cityImage) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-0 h-[65vh] h-screen blur-xs opacity-15 overflow-hidden pointer-events-none">
      <div
        className="absolute top-0 left-0 right-0 h-screen"
        style={{
          backgroundImage: `url("${cityImage}")`,
          backgroundSize: 'cover',
          backgroundPosition: '50% 35%',
          maskImage: 'linear-gradient(to bottom, black 0%, black 50%, transparent 100%)',
          WebkitMaskImage: 'linear-gradient(to bottom, black 0%, black 50%, transparent 100%)',
        }}
      />
    </div>
  );
};

export default CityImageBackdrop;
