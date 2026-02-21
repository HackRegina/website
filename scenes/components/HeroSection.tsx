'use client';
import Image from 'next/image';
import { useState } from 'react';

export const HeroSection = () => {
  const [videoStatus, setVideoStatus] = useState<'idle' | 'playing' | 'paused'>('idle');
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28">
      <div className="flex flex-col md:flex-row items-center gap-8 md:gap-10">
        {/* Left Content */}
        <div className="flex-1 space-y-5 md:space-y-10">
          <h1 className="text-3xl sm:text-4xl lg:text-6xl font-semibold leading-tight">
            <span className="relative inline-block">
              <span className="relative z-10">Code together,</span>
              <span className="absolute bottom-1 left-0 w-full h-[30%] bg-primary-300 dark:bg-primary-700 -z-10" />
            </span>
            <br />
            <span className="text-primary-700 dark:text-primary-300">as a Community</span>
          </h1>
          <p className="text-gray-500 dark:text-gray-400 text-lg">
            Breaking down the silos of technology ventures is how we hope to help grow a strong
            community that can support each other. Our goal is to assist individuals' growth by
            providing opportunities to collaborate, learn, and grow together.
          </p>
          <div>
            <a
              href="http://joinslack.hackregina.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block bg-primary-700 hover:bg-primary-500 text-white rounded-full px-6 py-3 text-lg transition-colors"
            >
              Join today
            </a>
          </div>
        </div>

        {/* Right Video */}
        <div className="flex-1 flex justify-center items-center relative w-full">
          {/* Blob Background */}
          <svg
            aria-hidden="true"
            className="absolute w-[150%] h-[150%] -top-[20%] left-0 -z-10 text-primary-100 dark:text-primary-400 hidden md:block"
            viewBox="0 0 578 440"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M239.184 439.443c-55.13-5.419-110.241-21.365-151.074-58.767C42.307 338.722-7.478 282.729.938 221.217c8.433-61.644 78.896-91.048 126.871-130.712 34.337-28.388 70.198-51.348 112.004-66.78C282.34 8.024 325.382-3.369 370.518.904c54.019 5.115 112.774 10.886 150.881 49.482 39.916 40.427 49.421 100.753 53.385 157.402 4.13 59.015 11.255 128.44-30.444 170.44-41.383 41.683-111.6 19.106-169.213 30.663-46.68 9.364-88.56 35.21-135.943 30.551z"
              fill="currentColor"
            />
          </svg>

          {/* Video Container */}
          <div className="relative h-[300px] w-full rounded-2xl shadow-2xl overflow-hidden">
            {videoStatus === 'idle' && (
              <>
                <button
                  type="button"
                  onClick={() => setVideoStatus('playing')}
                  className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10 hover:scale-110 transition-transform"
                  aria-label="Play video"
                >
                  <svg
                    aria-hidden="true"
                    width="58"
                    height="58"
                    viewBox="0 0 58 58"
                    fill="white"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M28.9999 0.562988C13.3196 0.562988 0.562378 13.3202 0.562378 29.0005C0.562378 44.6808 13.3196 57.438 28.9999 57.438C44.6801 57.438 57.4374 44.6808 57.4374 29.0005C57.4374 13.3202 44.6801 0.562988 28.9999 0.562988ZM39.2223 30.272L23.5749 39.7247C23.3506 39.8591 23.0946 39.9314 22.8332 39.9342C22.5717 39.9369 22.3142 39.8701 22.0871 39.7406C21.86 39.611 21.6715 39.4234 21.5408 39.1969C21.4102 38.9705 21.3421 38.7133 21.3436 38.4519V19.5491C21.3421 19.2877 21.4102 19.0305 21.5408 18.8041C21.6715 18.5776 21.86 18.3899 22.0871 18.2604C22.3142 18.1308 22.5717 18.064 22.8332 18.0668C23.0946 18.0696 23.3506 18.1419 23.5749 18.2763L39.2223 27.729C39.4404 27.8619 39.6207 28.0486 39.7458 28.2713C39.8709 28.494 39.9366 28.7451 39.9366 29.0005C39.9366 29.2559 39.8709 29.507 39.7458 29.7297C39.6207 29.9523 39.4404 30.1391 39.2223 30.272Z" />
                  </svg>
                  <span className="sr-only">Play video</span>
                </button>
                <Image
                  src="/images/hackathon_2023.png"
                  alt="Hackathon 2023"
                  fill
                  className="object-cover"
                />
              </>
            )}
            {(videoStatus === 'paused' || videoStatus === 'playing') && (
              <video
                src="/videos/hackathon_2023.mp4"
                poster="/images/hackathon_2023.png"
                className="w-full h-full object-cover"
                autoPlay
                muted
                onClick={(e) => {
                  if (videoStatus === 'playing') {
                    e.currentTarget.pause();
                    setVideoStatus('paused');
                  } else {
                    e.currentTarget.play();
                    setVideoStatus('playing');
                  }
                }}
              />
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
