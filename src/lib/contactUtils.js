import { useEffect, useState } from "react";

const FALLBACK_NAME = "Shivam Raj Gupta";
const DEVELOPER_INFO_API_URL = "https://credit-api.vercel.app/api/credits";

/**
 * Sanitizes a phone number by removing spaces, dashes, and parentheses
 * @param {string} phone - The phone number to sanitize
 * @returns {string} - The sanitized phone number
 */
export const sanitizePhone = (phone) => {
  if (!phone) return "";
  return phone.replace(/[\s\-()]/g, "");
};

/**
 * Formats an address object into an array of address lines
 * @param {Object} address - The address object with line1, line2, city, and pincode
 * @returns {Array<string>} - Array of address lines
 */
export const formatAddress = (address) => {
  if (!address) return [];
  const parts = [];
  if (address.line1) parts.push(address.line1);
  if (address.line2) parts.push(address.line2);
  if (address.city) {
    const cityPart = address.pincode
      ? `${address.city} - ${address.pincode}`
      : address.city;
    parts.push(cityPart);
  }
  return parts;
};

/**
 * Formats an address object into a single string
 * @param {Object} address - The address object with line1, line2, city, and pincode
 * @returns {string|null} - Formatted address string or null if no address
 */
export const formatAddressString = (address) => {
  if (!address) return null;
  const parts = [];
  if (address.line2) parts.push(address.line2);
  if (address.city) {
    const cityPart = address.pincode
      ? `${address.city} - ${address.pincode}`
      : address.city;
    parts.push(cityPart);
  }
  return parts.length > 0 ? parts.join(", ") : null;
};

/**
 * Custom hook to fetch developer information from the API
 * @returns {Object} - Object containing developerInfo, loading state, and fallback name
 */
export const useDeveloperInfo = () => {
  const [developerInfo, setDeveloperInfo] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const controller = new AbortController();

    const fetchDeveloperInfo = async () => {
      try {
        const response = await fetch(DEVELOPER_INFO_API_URL, {
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error("Fetch failed");
        }

        const data = await response.json();
        setDeveloperInfo(data);
      } catch (err) {
        if (err.name !== "AbortError") {
          console.error("Developer info fetch failed:", err);
          setDeveloperInfo({ credit: FALLBACK_NAME, linkedin: null });
        }
      } finally {
        setLoading(false);
      }
    };

    fetchDeveloperInfo();
    return () => controller.abort();
  }, []);

  return { developerInfo, loading, fallbackName: FALLBACK_NAME };
};

