import PropTypes from "prop-types";
import { useState, useEffect } from "react";
import SideNav from "../../Components/SideNav";
import { FaCloudUploadAlt, FaTrash, FaChevronDown, FaSpinner } from "react-icons/fa";
import { v4 as uuidv4 } from "uuid";
import { useDropzone } from "react-dropzone";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { createProduct } from "../../redux/actions/product";

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
  const [didSubmit, setDidSubmit] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    dispatch({ type: "resetProductCreate" });
  }, [dispatch]);

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
    if (e.key === "Enter" || e.type === "blur") {
      // Trim input and split by commas
      const newTags = tagInput
        .split(",")  // Split by commas
        .map(tag => tag.trim())  // Trim spaces around each tag
        .filter(tag => tag !== "" && !productData.tags.includes(tag));  // Remove duplicates and empty tags

      // If there are valid tags, update the product data
      if (newTags.length > 0) {
        setProductData({
          ...productData,
          tags: [...productData.tags, ...newTags], // Add new tags to the existing ones
        });
      }

      // Clear the input after adding the tags
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

  const handleSubmit = (e) => {
    e.preventDefault();
    setDidSubmit(true);
    setLoading(true);

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
    if (productData.salePrice && !isNaN(parseFloat(productData.salePrice))) {
      newForm.append("salePrice", parseFloat(productData.salePrice));
    }

    dispatch(createProduct(newForm));
  };

  useEffect(() => {
    if (!didSubmit) {
      setLoading(false);
      return;
    }

    if (error) {
      setLoading(false);
      toast.error(error);
    }

    if (success) {
      setLoading(false);
      toast.success("Product Created Successfully.");
      navigate("/seller/all-products");
    }
  }, [success, error, didSubmit, navigate]);

  const [categorySearch, setCategorySearch] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

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
    <div className="flex flex-col lg:flex-row min-h-screen bg-gray-100 mt-14">
      <SideNav />
      <div className="flex-1 p-4 sm:p-6 lg:p-8  lg:ml-64 w-full">
        <h1 className="text-2xl sm:text-4xl font-bold text-gray-900 mb-2">🛍️ Add New Product</h1>
        <p className="text-gray-600 mb-6">Fill in the details to add a new product to your store.</p>

        <form
          onSubmit={handleSubmit}
          className="bg-white p-6 sm:p-8 rounded-lg shadow-lg w-full max-w-5xl mx-auto"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Name */}
            <div>
              <label className="block text-gray-700 font-semibold">Product Name</label>
              <input
                type="text"
                name="name"
                value={productData.name}
                onChange={handleChange}
                className="w-full p-3 mt-2 border rounded-lg focus:ring-blue-400"
                required
              />
            </div>

            {/* Category */}
            <div>
              <label className="block text-gray-700 font-semibold">Product Category</label>
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="w-full p-3 mt-2 border rounded-lg flex justify-between items-center bg-white"
                >
                  {productData.category || "-- Select a Category --"}
                  <FaChevronDown className="text-gray-500" />
                </button>

                {isDropdownOpen && (
                  <div className="absolute z-10 bg-white border w-full mt-2 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                    <input
                      type="text"
                      placeholder="Search category..."
                      value={categorySearch}
                      onChange={(e) => setCategorySearch(e.target.value)}
                      className="w-full px-3 py-2 border-b focus:outline-none"
                    />
                    {category
                      .filter((cat) =>
                        cat.toLowerCase().includes(categorySearch.toLowerCase())
                      )
                      .map((cat, index) => (
                        <div
                          key={index}
                          onClick={() => {
                            setProductData({ ...productData, category: cat });
                            setIsDropdownOpen(false);
                            setCategorySearch("");
                          }}
                          className="px-4 py-2 hover:bg-blue-100 cursor-pointer"
                        >
                          {cat.charAt(0).toUpperCase() + cat.slice(1)}
                        </div>
                      ))}
                    {category.filter((cat) =>
                      cat.toLowerCase().includes(categorySearch.toLowerCase())
                    ).length === 0 && (
                        <div className="px-4 py-2 text-gray-400">
                          No categories found
                        </div>
                      )}
                  </div>
                )}
              </div>
            </div>

            {/* Price, Sale Price, Stock, Tags */}
            <div>
              <label className="block text-gray-700 font-semibold">New Price ($)</label>
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
              <label className="block text-gray-700 font-semibold">Old Price ($)</label>
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
                onBlur={handleTagInput}
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

            {/* Toggle Customization */}
            <div>
              <label className="block text-gray-700 font-semibold">&nbsp;</label>
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

          {/* Description */}
          <div className="mt-6">
            <label className="block text-gray-700 font-semibold">Product Description</label>
            <textarea
              name="description"
              value={productData.description}
              onChange={handleChange}
              className="w-full p-3 mt-2 border rounded-lg focus:ring-blue-400"
              rows="4"
              required
            ></textarea>
          </div>

          {/* Dropzone + Image Previews */}
          <div className="mt-6">
            <label className="block text-gray-700 font-semibold">Product Images</label>
            <div
              {...getRootProps()}
              className={`group w-full mt-4 p-6 border-2 rounded-lg cursor-pointer text-center transition-all duration-300 ease-in-out ${isDragActive
                ? "border-blue-500 bg-blue-50 shadow-lg"
                : "border-dashed border-gray-300 hover:border-blue-500 hover:bg-blue-50 hover:shadow-md"
                }`}
            >
              <input {...getInputProps()} />
              <FaCloudUploadAlt
                className={`mx-auto text-4xl transition-colors duration-300 ${isDragActive
                  ? "text-blue-500"
                  : "text-gray-500 group-hover:text-blue-500"
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

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mt-4">
              {imagePreviews.map((image) => (
                <SortableImage
                  key={image.id}
                  image={image}
                  onRemove={handleRemoveImage}
                />
              ))}
            </div>

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

          {/* Submit */}
          <div className="mt-8 text-center">
            <button
              type="submit"
              className="w-full py-3 px-4 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-all"
              disabled={loading} // Disable the button when loading
            >
              {loading ? (
                <FaSpinner className="animate-spin mx-auto text-white" /> // Loader icon
              ) : (
                "Save Product"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateProduct;
