import PropTypes from "prop-types";
import { useState, useEffect } from "react";
import SideNav from "../../Components/SideNav";
import { FaCloudUploadAlt, FaTrash } from "react-icons/fa";
import { v4 as uuidv4 } from "uuid";
import { useDropzone } from "react-dropzone";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { createProduct } from "../../redux/actions/product";

// Sortable Image Component
const SortableImage = ({ image, onRemove }) => {
  return (
    <div className="relative group cursor-grab">
      <img
        src={image.preview}
        alt="Preview"
        className="w-full h-28 object-cover rounded-md border shadow-md"
      />
      <button
        type="button"
        className="absolute -top-2 -right-2 bg-red-500 text-white w-6 h-6 items-center justify-center rounded-full text-sm hidden group-hover:flex transition-all"
        onClick={(e) => {
          e.stopPropagation();
          onRemove(image.id);
        }}
      >
        <FaTrash />
      </button>
    </div>
  );
};

SortableImage.propTypes = {
  image: PropTypes.shape({
    id: PropTypes.string.isRequired,
    preview: PropTypes.string.isRequired,
  }).isRequired,
  onRemove: PropTypes.func.isRequired,
};

const category = ["mobile", "laptop", "camera", "watch", "headphone"];

const CreateProduct = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const seller = useSelector((state) => state.seller.user);
  const { success, error } = useSelector((state) => state.product);

  


  const [productData, setProductData] = useState({
    name: "",
    price: "",
    salePrice: "",
    description: "",
    stock: "",
    category: "",
    images: [],
    tags: [],
    isCustomizable: false,
  });

  const [imagePreviews, setImagePreviews] = useState([]);
  const [tagInput, setTagInput] = useState("");

  useEffect(() => {
    return () => {
      imagePreviews.forEach((img) => URL.revokeObjectURL(img.preview));
    };
  }, [imagePreviews]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setProductData({
      ...productData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleImageChange = (acceptedFiles) => {
    const validImages = acceptedFiles.filter((file) =>
      file.type.startsWith("image/")
    );

    const newImages = validImages.map((file) => {
      const previewUrl = URL.createObjectURL(file);
      return {
        id: uuidv4(),
        file,
        preview: previewUrl,
      };
    });

    setImagePreviews((prev) => [...prev, ...newImages]);

    setProductData((prev) => ({
      ...prev,
      images: [...prev.images, ...validImages],
    }));
  };

  const handleRemoveImage = (id) => {
    setImagePreviews((prevPreviews) => {
      const imageToRemove = prevPreviews.find((img) => img.id === id);
      if (!imageToRemove) return prevPreviews;

      URL.revokeObjectURL(imageToRemove.preview);

      const newPreviews = prevPreviews.filter((img) => img.id !== id);

      setProductData((prevData) => {
        const newFiles = prevData.images.filter(
          (_, index) => index !== prevPreviews.findIndex((img) => img.id === id)
        );
        return {
          ...prevData,
          images: newFiles,
        };
      });

      return newPreviews;
    });
  };

  const handleClearAllImages = () => {
    imagePreviews.forEach((img) => URL.revokeObjectURL(img.preview));
    setImagePreviews([]);
    setProductData((prev) => ({ ...prev, images: [] }));
  };

  const handleTagInput = (e) => {
    if (
      e.key === "Enter" &&
      tagInput.trim() !== "" &&
      productData.tags.length < 15
    ) {
      e.preventDefault();
      if (!productData.tags.includes(tagInput.trim())) {
        setProductData({
          ...productData,
          tags: [...productData.tags, tagInput.trim()],
        });
      }
      setTagInput("");
    }
  };

  const removeTag = (tagToRemove) => {
    setProductData({
      ...productData,
      tags: productData.tags.filter((tag) => tag !== tagToRemove),
    });
  };

  const clearAllTags = () => {
    setProductData({ ...productData, tags: [] });
  };

  // console.log(seller);
  const handleSubmit = (e) => {
    e.preventDefault();

    const newForm = new FormData();
    productData.images.forEach((image) => newForm.append("images", image));
    newForm.append("name", productData.name);
    newForm.append("price", productData.price);
    newForm.append("description", productData.description);
    newForm.append("stock", productData.stock);
    newForm.append("category", productData.category);
    newForm.append("isCustomizable", productData.isCustomizable);
    newForm.append("shopId", seller._id);
    productData.tags.forEach((tag) => newForm.append("tags", tag));

    const salePrice = productData.salePrice && !isNaN(parseFloat(productData.salePrice));

    if (salePrice) {
      newForm.append("salePrice", parseFloat(productData.salePrice));
    }


    // Dispatch product creation here, e.g.:
    dispatch(createProduct(newForm));
  };

  useEffect(() => {
    // Reset success flag when the component is loaded again
    dispatch({ type: "resetProductCreate" });
  
    if (error) toast.error(error);
  
    if (success) {
      toast.success("Product Created Successfully.");
      // Reset success state after showing the toast to prevent it from triggering again
      dispatch({ type: "resetProductCreate" });
      navigate("/seller/all-products"); // Uncomment if needed for redirection after success
    }
  }, [dispatch, success, error, navigate]);
  
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: handleImageChange,
    accept: {
      "image/jpeg": [],
      "image/jpg": [],
      "image/png": [],
      "image/webp": [],
    },
    onDropRejected: (fileRejections) => {
      fileRejections.forEach((rejection) => {
        toast.error(`Skipped "${rejection.file.name}": Invalid file type.`);
      });
    },
    multiple: true,
  });


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
                className="w-full p-3 mt-2 border rounded-lg focus:ring-blue-400"
                required
              />
            </div>

            <div>
              <label className="block text-gray-700 font-semibold">
                Product Category
              </label>
              <select
                name="category"
                value={productData.category}
                onChange={handleChange}
                className="w-full p-3 mt-2 border rounded-lg focus:ring-blue-400"
                required
              >
                <option value="">-- Select a Category --</option>
                {category.map((cat, index) => (
                  <option key={index} value={cat}>
                    {cat.charAt(0).toUpperCase() + cat.slice(1)}
                  </option>
                ))}
              </select>
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
                className="w-full p-3 mt-2 border rounded-lg focus:ring-blue-400"
                required
              />
            </div>

            <div>
              <label className="block text-gray-700 font-semibold">
                Sale Price ($)
              </label>
              <input
                type="number"
                name="salePrice"
                value={productData.salePrice}
                onChange={handleChange}
                className="w-full p-3 mt-2 border rounded-lg focus:ring-blue-400"
              />
            </div>

            <div>
              <label className="block text-gray-700 font-semibold">Stock</label>
              <input
                type="number"
                name="stock"
                value={productData.stock}
                onChange={handleChange}
                className="w-full p-3 mt-2 border rounded-lg focus:ring-blue-400"
                required
              />
            </div>

            <div>
              <label className="block text-gray-700 font-semibold">Tags</label>
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={handleTagInput}
                placeholder="Type and press Enter"
                className="w-full p-3 mt-2 border rounded-lg focus:ring-blue-400"
                disabled={productData.tags.length >= 15}
              />
              <div className="flex flex-wrap mt-2 gap-2">
                {productData.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm flex items-center gap-2"
                  >
                    {tag}
                    <button
                      type="button"
                      onClick={() => removeTag(tag)}
                      className="text-blue-500 hover:text-red-500"
                    >
                      &times;
                    </button>
                  </span>
                ))}
              </div>
              {productData.tags.length >= 15 && (
                <p className="text-xs text-red-500 mt-2">
                  Tag limit reached (15 max)
                </p>
              )}
              {productData.tags.length > 0 && (
                <button
                  type="button"
                  onClick={clearAllTags}
                  className="mt-4 text-xs px-3 py-1 bg-red-500 text-white rounded-full"
                >
                  Clear All Tags
                </button>
              )}
            </div>

            <div>
              <label className="block text-gray-700 font-semibold">
                &nbsp;
              </label>
              <label className="inline-flex items-center mt-2">
                <span className="relative">
                  <input
                    type="checkbox"
                    name="isCustomizable"
                    checked={productData.isCustomizable}
                    onChange={handleChange}
                    className="sr-only peer"
                  />
                  <div className="w-12 h-6 bg-gray-300 rounded-full peer-checked:bg-blue-500 transition-all duration-300"></div>
                  <div className="absolute left-0 top-0 w-6 h-6 bg-white border rounded-full shadow peer-checked:translate-x-full transition-all duration-300"></div>
                </span>
                <span className="ml-3 text-gray-600">Enable Customization</span>
              </label>
            </div>
          </div>

          <div className="mt-6">
            <label className="block text-gray-700 font-semibold">
              Product Description
            </label>
            <textarea
              name="description"
              value={productData.description}
              onChange={handleChange}
              className="w-full p-3 mt-2 border rounded-lg focus:ring-blue-400"
              rows="4"
              required
            ></textarea>
          </div>

          <div className="mt-6">
            <label className="block text-gray-700 font-semibold">
              Product Images
            </label>

            {/* Upload Dropzone with Hover + Drag Effect */}
            <div
              {...getRootProps()}
              className={`group w-full mt-4 p-6 border-2 rounded-lg cursor-pointer text-center transition-all duration-300 ease-in-out
      ${isDragActive
                  ? "border-blue-500 bg-blue-50 shadow-lg"
                  : "border-dashed border-gray-300 hover:border-blue-500 hover:bg-blue-50 hover:shadow-md"
                }`}
            >
              <input {...getInputProps()} />
              <FaCloudUploadAlt
                className={`mx-auto text-4xl transition-colors duration-300 ${isDragActive ? "text-blue-500" : "text-gray-500 group-hover:text-blue-500"
                  }`}
              />
              <p
                className={`mt-2 text-gray-600 transition-colors duration-300 ${isDragActive ? "text-blue-600" : "group-hover:text-blue-600"
                  }`}
              >
                {isDragActive
                  ? "Drop the files here..."
                  : "Drag and drop images here, or click to select"}
              </p>
            </div>

            {/* Image Previews */}
            <div className="flex flex-wrap gap-4 mt-4">
              {imagePreviews.map((image) => (
                <SortableImage
                  key={image.id}
                  image={image}
                  onRemove={handleRemoveImage}
                />
              ))}
            </div>

            {/* Clear All Button */}
            {imagePreviews.length > 0 && (
              <button
                type="button"
                onClick={handleClearAllImages}
                className="mt-4 text-xs px-3 py-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-all"
              >
                Clear All Images
              </button>
            )}
          </div>

          <div className="mt-8 text-center">
            <button
              type="submit"
              className="w-full py-3 px-4 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-all"
            >
              Save Product
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateProduct;
