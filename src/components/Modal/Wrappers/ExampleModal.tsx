'use client';

import Modal from '../Modal';

export default function ExampleModal() {
  return (
    <Modal type="EXAMPLE">
      <div className="flex flex-col gap-4">
        <span className="p-10 text-gray-800">This is example Modal</span>
      </div>
    </Modal>
  );
}
