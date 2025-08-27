import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Save, X, Package } from 'lucide-react';

interface Product {
  id: string;
  name: string;
  category: string;
  stock: number;
  price: number;
  gst: string;
  condition: string;
}

const Products: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newProduct, setNewProduct] = useState({
    name: '',
    category: 'T-Shirt',
    stock: 0,
    price: 0,
    gst: '18%',
    condition: 'New'
  });

  const categories = ['T-Shirt', 'Pants', 'Shoes', 'Watches', 'Accessories', 'Electronics', 'Sports'];
  const gstOptions = ['0%', '5%', '12%', '18%', '28%'];
  const conditions = ['New', 'Good', 'Fair', 'Refurbished', 'Used'];

  useEffect(() => {
    const savedProducts = localStorage.getItem('shippy_products');
    if (savedProducts) {
      setProducts(JSON.parse(savedProducts));
    } else {
      // Initialize with sample data
      const initialProducts: Product[] = [
        { id: '1', name: 'Cotton T-Shirt', category: 'T-Shirt', stock: 150, price: 599, gst: '18%', condition: 'New' },
        { id: '2', name: 'Polo T-Shirt', category: 'T-Shirt', stock: 120, price: 799, gst: '18%', condition: 'New' },
        { id: '3', name: 'Denim Jeans', category: 'Pants', stock: 80, price: 1299, gst: '18%', condition: 'New' },
        { id: '4', name: 'Cargo Pants', category: 'Pants', stock: 60, price: 1599, gst: '18%', condition: 'New' },
        { id: '5', name: 'Running Shoes', category: 'Shoes', stock: 45, price: 2499, gst: '18%', condition: 'New' },
        { id: '6', name: 'Casual Sneakers', category: 'Shoes', stock: 35, price: 1899, gst: '18%', condition: 'New' },
        { id: '7', name: 'Smart Watch', category: 'Watches', stock: 25, price: 4999, gst: '18%', condition: 'New' },
        { id: '8', name: 'Analog Watch', category: 'Watches', stock: 40, price: 2299, gst: '18%', condition: 'New' },
        { id: '9', name: 'Leather Belt', category: 'Accessories', stock: 70, price: 899, gst: '18%', condition: 'New' },
        { id: '10', name: 'Sunglasses', category: 'Accessories', stock: 55, price: 1199, gst: '18%', condition: 'New' },
      ];
      setProducts(initialProducts);
      localStorage.setItem('shippy_products', JSON.stringify(initialProducts));
    }
  }, []);

  const saveProducts = (updatedProducts: Product[]) => {
    setProducts(updatedProducts);
    localStorage.setItem('shippy_products', JSON.stringify(updatedProducts));
  };

  const handleAddProduct = () => {
    if (newProduct.name.trim()) {
      const product: Product = {
        id: Date.now().toString(),
        ...newProduct
      };
      const updatedProducts = [...products, product];
      saveProducts(updatedProducts);
      setNewProduct({ name: '', category: 'T-Shirt', stock: 0, price: 0, gst: '18%', condition: 'New' });
      setShowAddForm(false);
    }
  };

  const handleEditProduct = (id: string, field: keyof Product, value: any) => {
    const updatedProducts = products.map(product =>
      product.id === id ? { ...product, [field]: value } : product
    );
    saveProducts(updatedProducts);
  };

  const handleDeleteProduct = (id: string) => {
    const updatedProducts = products.filter(product => product.id !== id);
    saveProducts(updatedProducts);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Product Management</h2>
          <p className="text-gray-600">Manage your inventory stock, prices, and product details.</p>
        </div>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg flex items-center space-x-2 transition-colors duration-200"
        >
          <Plus className="h-5 w-5" />
          <span>Add Product</span>
        </button>
      </div>

      {showAddForm && (
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">Add New Product</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Product Name</label>
              <input
                type="text"
                value={newProduct.name}
                onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter product name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
              <select
                value={newProduct.category}
                onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Stock</label>
              <input
                type="number"
                value={newProduct.stock}
                onChange={(e) => setNewProduct({ ...newProduct, stock: parseInt(e.target.value) || 0 })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                min="0"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Price (₹)</label>
              <input
                type="number"
                value={newProduct.price}
                onChange={(e) => setNewProduct({ ...newProduct, price: parseFloat(e.target.value) || 0 })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                min="0"
                step="0.01"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">GST</label>
              <select
                value={newProduct.gst}
                onChange={(e) => setNewProduct({ ...newProduct, gst: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {gstOptions.map(gst => (
                  <option key={gst} value={gst}>{gst}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Condition</label>
              <select
                value={newProduct.condition}
                onChange={(e) => setNewProduct({ ...newProduct, condition: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {conditions.map(condition => (
                  <option key={condition} value={condition}>{condition}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="flex items-center space-x-4 mt-6">
            <button
              onClick={handleAddProduct}
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg flex items-center space-x-2 transition-colors duration-200"
            >
              <Save className="h-4 w-4" />
              <span>Save Product</span>
            </button>
            <button
              onClick={() => setShowAddForm(false)}
              className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-2 rounded-lg flex items-center space-x-2 transition-colors duration-200"
            >
              <X className="h-4 w-4" />
              <span>Cancel</span>
            </button>
          </div>
        </div>
      )}

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Product Inventory</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stock</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">GST</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Condition</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {products.map((product) => (
                <tr key={product.id} className="hover:bg-gray-50 transition-colors duration-200">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="h-10 w-10 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                        <Package className="h-5 w-5 text-blue-600" />
                      </div>
                      {editingId === product.id ? (
                        <input
                          type="text"
                          value={product.name}
                          onChange={(e) => handleEditProduct(product.id, 'name', e.target.value)}
                          className="text-sm font-medium text-gray-900 border-b border-gray-300 bg-transparent focus:outline-none focus:border-blue-500"
                        />
                      ) : (
                        <div className="text-sm font-medium text-gray-900">{product.name}</div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {editingId === product.id ? (
                      <select
                        value={product.category}
                        onChange={(e) => handleEditProduct(product.id, 'category', e.target.value)}
                        className="text-sm text-gray-900 border-b border-gray-300 bg-transparent focus:outline-none focus:border-blue-500"
                      >
                        {categories.map(category => (
                          <option key={category} value={category}>{category}</option>
                        ))}
                      </select>
                    ) : (
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                        {product.category}
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {editingId === product.id ? (
                      <input
                        type="number"
                        value={product.stock}
                        onChange={(e) => handleEditProduct(product.id, 'stock', parseInt(e.target.value) || 0)}
                        className="text-sm text-gray-900 border-b border-gray-300 bg-transparent focus:outline-none focus:border-blue-500 w-20"
                        min="0"
                      />
                    ) : (
                      <div className="text-sm text-gray-900">{product.stock}</div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {editingId === product.id ? (
                      <input
                        type="number"
                        value={product.price}
                        onChange={(e) => handleEditProduct(product.id, 'price', parseFloat(e.target.value) || 0)}
                        className="text-sm text-gray-900 border-b border-gray-300 bg-transparent focus:outline-none focus:border-blue-500 w-24"
                        min="0"
                        step="0.01"
                      />
                    ) : (
                      <div className="text-sm text-gray-900">₹{product.price.toFixed(2)}</div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {editingId === product.id ? (
                      <select
                        value={product.gst}
                        onChange={(e) => handleEditProduct(product.id, 'gst', e.target.value)}
                        className="text-sm text-gray-900 border-b border-gray-300 bg-transparent focus:outline-none focus:border-blue-500"
                      >
                        {gstOptions.map(gst => (
                          <option key={gst} value={gst}>{gst}</option>
                        ))}
                      </select>
                    ) : (
                      <div className="text-sm text-gray-900">{product.gst}</div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {editingId === product.id ? (
                      <select
                        value={product.condition}
                        onChange={(e) => handleEditProduct(product.id, 'condition', e.target.value)}
                        className="text-sm text-gray-900 border-b border-gray-300 bg-transparent focus:outline-none focus:border-blue-500"
                      >
                        {conditions.map(condition => (
                          <option key={condition} value={condition}>{condition}</option>
                        ))}
                      </select>
                    ) : (
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        product.condition === 'New' ? 'bg-green-100 text-green-800' :
                        product.condition === 'Good' ? 'bg-yellow-100 text-yellow-800' :
                        product.condition === 'Fair' ? 'bg-orange-100 text-orange-800' :
                        'bg-purple-100 text-purple-800'
                      }`}>
                        {product.condition}
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center space-x-2">
                      {editingId === product.id ? (
                        <>
                          <button
                            onClick={() => setEditingId(null)}
                            className="text-green-600 hover:text-green-900 transition-colors duration-200"
                          >
                            <Save className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => setEditingId(null)}
                            className="text-gray-600 hover:text-gray-900 transition-colors duration-200"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </>
                      ) : (
                        <button
                          onClick={() => setEditingId(product.id)}
                          className="text-blue-600 hover:text-blue-900 transition-colors duration-200"
                        >
                          <Edit2 className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Products;