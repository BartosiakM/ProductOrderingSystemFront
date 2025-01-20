import React, { useState, useEffect } from 'react';
import { Product } from '../types';
import { fetchProducts } from "../utils/api";
import api from '../utils/api';
import Navbar from "../components/Navbar";

const DbInitPage: React.FC = () => {
    const [fileContent, setFileContent] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState<boolean>(false);

    useEffect(() => {
        const loadProducts = async () => {
            try {
                const fetchedProducts = await fetchProducts();
                setProducts(fetchedProducts);
            } catch (err) {
                console.error('Failed to fetch products:', err);
                setError('Failed to load existing products.');
            }
        };

        loadProducts();
    }, []);

    const validateFileContent = (content: string): boolean => {
        try {
            const jsonContent = JSON.parse(content);
            return Array.isArray(jsonContent) && jsonContent.every(isValidProduct);
        } catch {
            return false;
        }
    };

    const isValidProduct = (obj: unknown): obj is Omit<Product, 'id' | 'descriptionHTML'> => {
        if (typeof obj !== 'object' || obj === null) return false;

        const { name, description, unitPrice, unitWeight, categoryId } = obj as Partial<Omit<Product, 'id' | 'descriptionHTML'>>;

        return (
            typeof name === 'string' && name.trim() !== '' &&
            typeof description === 'string' && description.trim() !== '' &&
            typeof unitPrice === 'number' && unitPrice > 0 &&
            typeof unitWeight === 'number' && unitWeight > 0 &&
            typeof categoryId === 'number'
        );
    };

    const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>): void => {
        const file = event.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            const content = e.target?.result as string;
            if (validateFileContent(content)) {
                setFileContent(content);
                setError(null);
            } else {
                setFileContent(null);
                setError('Invalid file content. Please upload a valid file containing a list of products.');
            }
        };
        reader.onerror = () => setError('Failed to read the file.');
        reader.readAsText(file);
    };

    const handleDbInit = async (): Promise<void> => {
        if (!fileContent) {
            setError('No valid file content to upload.');
            return;
        }

        setLoading(true);
        setSuccess(null);
        setError(null);

        try {
            const products: Product[] = JSON.parse(fileContent);
            const response = await api.post('/init/custom', { products });
            setSuccess(response.data.message);
            setProducts(products);
        } catch (err: unknown) {
            const error = err as { response?: { data?: { error?: string }; status?: number }; message?: string };
            const errorMessage = error.response?.data?.error || error.message || 'An unexpected error occurred.';
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container-fluid main-content">
            <Navbar />
            <h1>Initialize Database</h1>
            <div className="mb-3">
                <input
                    type="file"
                    className="form-control"
                    accept=".txt,.json"
                    onChange={handleFileUpload}
                />
            </div>
            {error && <p className="text-danger">{error}</p>}
            {success && <p className="text-success">{success}</p>}
            {!error && !success && fileContent && <p className="text-success">File content is valid.</p>}
            {!success && products.length > 1 && <p className="text-danger">Database already initialized.</p>}
            <button
                className="btn btn-primary mb-3"
                onClick={handleDbInit}
                disabled={!fileContent || products.length > 1 || loading}
            >
                {loading ? 'Initializing...' : 'Initialize'}
            </button>
            {fileContent && (
                <div className="mt-3">
                    <h3>File Content</h3>
                    <div className="border p-3" style={{ maxHeight: '500px', overflow: 'auto' }}>
                        <pre>{fileContent}</pre>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DbInitPage;