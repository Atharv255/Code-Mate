const Dialog = ({ user, onAdmit, onClose }) => {
  return (
    <div className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-4 bg-white shadow-md rounded-lg p-4 border border-gray-200 max-w-xs sm:max-w-sm md:max-w-md w-full">
      <p className="text-gray-800 text-sm sm:text-base">
        <strong>{user}</strong> has joined the room.
      </p>
      <div className="flex gap-2 mt-2">
        <button
          className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors 
            text-sm sm:text-base w-full sm:w-auto"
          onClick={onAdmit}
        >
          Admit
        </button>
      </div>
    </div>
  );
};

export default Dialog;
