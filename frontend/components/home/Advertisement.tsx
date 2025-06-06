import React from 'react';

interface AdvertisementProps {
  text?: string;
}

const Advertisement: React.FC<AdvertisementProps> = ({ text = "Advertisement Space" }) => {
  return (
    <div className="w-full bg-blue-100 h-20 my-8 flex items-center justify-center">
      <p className="text-blue-500">{text}</p>
    </div>
  );
};

export default Advertisement;
