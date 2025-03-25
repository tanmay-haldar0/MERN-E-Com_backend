import PropTypes from "prop-types"; // Optional but recommended
import { useState, useEffect } from "react";
import SideNav from "../../Components/SideNav";
import { FaCloudUploadAlt, FaTrash } from "react-icons/fa";
import { DndContext, closestCenter } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
  arrayMove,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { v4 as uuidv4 } from "uuid";

// Sortable Image Component
const SortableImage = ({ image, onRemove }) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: image.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="relative group cursor-grab"
    >
      <img
        src={image.preview}
        alt="Preview"
        className="w-full h-28 object-cover rounded-md border shadow-md"
      />
      <button
        type="button"
        className="absolute -top-2 -right-2 bg-red-500 text-white w-6 h-6 items-center justify-center rounded-full text-sm hidden group-hover:flex transition-all"
        onClick={(e) => {
          e.stopPropagation(); // Prevent triggering drag when clicking delete
          onRemove(image.id);
        }}
      >
        <FaTrash />
      </button>
    </div>
  );
};

// PropTypes for SortableImage (optional but recommended)
SortableImage.propTypes = {
  image: PropTypes.shape({
    id: PropTypes.string.isRequired,
    preview: PropTypes.string.isRequired,
  }).isRequired,
  onRemove: PropTypes.func.isRequired,
};

const CreateProduct = () => {
  const [productData, setProductData] = useState({
    name: "",
    price: "",
    description: "",
    stock: "",
    category: "",
    images: [],
  });

  const [imagePreviews, setImagePreviews] = useState([]);

  // Clean up object URLs when component unmounts
  useEffect(() => {
    return () => {
      imagePreviews.forEach((img) => URL.revokeObjectURL(img.preview));
    };
  }, [imagePreviews]);

  const handleChange = (e) => {
    setProductData({ ...productData, [e.target.name]: e.target.value });
  };

  // Handle Image Upload
  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    const newImages = files.map((file) => ({
      id: uuidv4(),
      file,
      preview: URL.createObjectURL(file),
    }));

    setImagePreviews((prev) => [...prev, ...newImages]);
    setProductData((prev) => ({
      ...prev,
      images: [...prev.images, ...files], // Store just the File objects
    }));
  };

  // Remove single image
  const handleRemoveImage = (id) => {
    setImagePreviews((prevPreviews) => {
      // Find the image to remove
      const imageToRemove = prevPreviews.find((img) => img.id === id);
      if (!imageToRemove) return prevPreviews;

      // Revoke the object URL
      URL.revokeObjectURL(imageToRemove.preview);

      // Filter out the image
      return prevPreviews.filter((img) => img.id !== id);
    });

    setProductData((prevData) => {
      // Find the corresponding file by matching the previews
      const currentPreviews = imagePreviews;
      const indexToRemove = currentPreviews.findIndex((img) => img.id === id);

      if (indexToRemove === -1) return prevData;

      // Filter out the file at the same index
      const newFiles = prevData.images.filter(
        (_, index) => index !== indexToRemove
      );

      return {
        ...prevData,
        images: newFiles,
      };
    });
  };

  // Clear all images
  const handleClearAllImages = () => {
    // Revoke all object URLs
    imagePreviews.forEach((img) => URL.revokeObjectURL(img.preview));

    setImagePreviews([]);
    setProductData((prev) => ({ ...prev, images: [] }));
  };

  // Handle Drag & Drop Sorting
  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = imagePreviews.findIndex((img) => img.id === active.id);
    const newIndex = imagePreviews.findIndex((img) => img.id === over.id);

    if (oldIndex === newIndex) return;

    // Reorder both previews and files arrays
    const newPreviews = arrayMove(imagePreviews, oldIndex, newIndex);
    const newFiles = arrayMove(productData.images, oldIndex, newIndex);

    setImagePreviews(newPreviews);
    setProductData((prev) => ({ ...prev, images: newFiles }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Product Data Submitted:", productData);
    // Here you would typically send the data to your backend
    // Don't forget to revoke URLs after upload if needed
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <SideNav />
      <div className="flex-1 p-8 ml-64 mt-16">
        <h1 className="text-4xl font-bold text-gray-900">🛍️ Add New Product</h1>
        <p className="text-gray-600 mb-6">
          Fill in the details to add a new product to your store.
        </p>

        <form
          onSubmit={handleSubmit}
          className="bg-white p-8 rounded-lg shadow-lg w-full max-w-5xl"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-gray-700 font-semibold">
                Product Name
              </label>
              <input
                type="text"
                name="name"
                value={productData.name}
                onChange={handleChange}
                className="w-full p-3 mt-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                required
              />
            </div>

            <div>
              <label className="block text-gray-700 font-semibold">
                Price ($)
              </label>
              <input
                type="number"
                name="price"
                value={productData.price}
                onChange={handleChange}
                className="w-full p-3 mt-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                required
              />
            </div>
          </div>

          <div className="mt-6">
            <label className="block text-gray-700 font-semibold">
              Product Images
            </label>
            <div className="mt-2 border-dashed border-2 border-gray-300 p-6 text-center bg-gray-50 rounded-lg hover:bg-gray-100 cursor-pointer transition relative">
              <FaCloudUploadAlt className="mx-auto text-4xl text-gray-500" />
              <p className="text-gray-600 mt-2">Click or Drag & Drop Images</p>
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageChange}
                className="absolute inset-0 opacity-0 cursor-pointer"
              />
            </div>

            {imagePreviews.length > 0 && (
              <div className="mt-4">
                <DndContext
                  collisionDetection={closestCenter}
                  onDragEnd={handleDragEnd}
                >
                  <SortableContext
                    items={imagePreviews.map((img) => img.id)}
                    strategy={verticalListSortingStrategy}
                  >
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {imagePreviews.map((img) => (
                        <SortableImage
                          key={img.id}
                          image={img}
                          onRemove={handleRemoveImage}
                        />
                      ))}
                    </div>
                  </SortableContext>
                </DndContext>

                {/* 🚀 Added "Clear All" Button */}
                <button
                  type="button"
                  className="mt-4 bg-red-500 text-white py-2 px-4 rounded-lg shadow-md hover:bg-red-600 transition"
                  onClick={handleClearAllImages}
                >
                  🗑️ Clear All Images
                </button>
              </div>
            )}
          </div>

          <button
            type="submit"
            className="mt-6 w-full bg-blue-500 text-white py-3 rounded-lg shadow-md hover:bg-blue-600 transition"
          >
            🚀 Add Product
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateProduct;
