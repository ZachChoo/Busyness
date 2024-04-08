import React from "react";
import Header from '../Components/Header';
import MobileMenu from '../Components/MobileMenu';

function Contact() {
  const handleSubmit = () => {
    alert("Thanks!")
  };


  return (
    <div>
    <Header />
    <MobileMenu />
    <div className="flex justify-center items-center h-screen">
        <div class="w-1/3">
            <div className="text-center text-5xl">Send us a message!</div>
            <form onSubmit={handleSubmit} className='py-20' action="https://public.herotofu.com/v1/a3e17590-b67a-11ec-b4fe-2b9cbf782176" method="post">
            <div className="mb-3 pt-0">
                <input
                type="text"
                placeholder="Your name"
                name="name"
                className="px-3 py-3 placeholder-gray-400 text-black bg-header-purple rounded text-sm shadow focus:outline-none focus:ring w-full"
                required
                />
            </div>
            <div className="mb-3 pt-0">
                <input
                type="email"
                placeholder="Email"
                name="email"
                className="px-3 py-3 placeholder-gray-400 text-black bg-header-purple rounded text-sm shadow focus:outline-none focus:ring w-full"
                required
                />
            </div>
            <div className="mb-3 pt-0">
                <textarea
                placeholder="Your message"
                name="message"
                className="px-3 py-3 placeholder-gray-400 text-black bg-header-purple rounded text-sm shadow focus:outline-none focus:ring w-full"
                required
                />
            </div>
            <div className="mb-3 pt-0">
                <button
                className="bg-blue-500 text-white active:bg-blue-600 font-bold text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                type="submit"
                >
                SUBMIT
                </button>
            </div>
            </form>
        </div>
    </div>
    </div>
  );
};

export default Contact;