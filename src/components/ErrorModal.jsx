import Modal from "react-modal";

Modal.setAppElement("#root"); // Set this to your app root ID to prevent accessibility warning

export default function ErrorModal({ errorText, buttonText, onButtonClick }) {
  return (
    <Modal
      isOpen={!!errorText}
      onRequestClose={onButtonClick}
      className="mx-auto w-9/10 max-w-md rounded-xl bg-white p-6 shadow-lg outline-none"
      overlayClassName="fixed inset-0 bg-black/50 flex justify-center items-center"
    >
      <h2 className="mb-4 text-xl font-semibold text-red-600">Error</h2>
      <p className="mb-6 text-gray-700">{errorText}</p>
      <button
        className="bg-accent hover:text-accent ring-accent cursor-pointer rounded px-4 py-2 text-white transition hover:bg-white hover:ring-1"
        onClick={onButtonClick}
      >
        {buttonText}
      </button>
    </Modal>
  );
}
