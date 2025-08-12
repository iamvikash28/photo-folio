import { useState, useEffect } from "react";
import styles from "./imageForm.module.css";
import { toast } from "react-toastify";

export const ImageForm = ({ onAdd, onUpdate, loading, albumName, updateIntent }) => {
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState("");

  useEffect(() => {
    if (updateIntent) {
      setTitle(updateIntent.title || "");
      setUrl(updateIntent.url || "");
    }
  }, [updateIntent]);

  useEffect(() => {
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
    } else if (url) {
      setPreview(url);
    } else {
      setPreview("");
    }
  }, [file, url]);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!title.trim()) {
      toast.error("Title is required.");
      return;
    }

    if (!url && !file) {
      toast.error("Please provide either a URL or a file.");
      return;
    }

    if (updateIntent) {
      onUpdate({ title, url });
    } else {
      onAdd({ title, url, file });
    }

    setTitle("");
    setUrl("");
    setFile(null);
    setPreview("");
  };

  return (
    <div className={styles.imageForm}>
      <span>{updateIntent ? "Update Image" : `Add Image to "${albumName}"`}</span>

      {/* Live Preview */}
      {preview && (
        <div style={{ textAlign: "center" }}>
          <img
            src={preview}
            alt="Preview"
            style={{
              maxWidth: "300px",
              maxHeight: "200px",
              borderRadius: "10px",
              margin: "10px 0",
              objectFit: "cover",
              boxShadow: "0 0 10px rgba(0,0,0,0.1)",
            }}
            onError={(e) => {
              e.currentTarget.src = "/assets/warning.png";
            }}
          />
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Image title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />

        <input
          type="url"
          placeholder="Image URL (optional)"
          value={url}
          onChange={(e) => {
            setUrl(e.target.value);
            if (e.target.value) setFile(null);
          }}
        />

        <input
          type="file"
          accept="image/*"
          onChange={(e) => {
            setFile(e.target.files[0]);
            if (e.target.files.length) setUrl("");
          }}
        />

        <div className={styles.actions}>
          <button
            type="submit"
            disabled={loading}
            style={{ backgroundColor: updateIntent ? "#0077ff" : "#0077ff" }}
          >
            {loading ? "Saving..." : updateIntent ? "Update" : "Add"}
          </button>
          <button
            type="button"
            onClick={() => {
              setTitle("");
              setUrl("");
              setFile(null);
              setPreview("");
            }}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};
