import React, { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { selectIsAuth } from "../../redux/auth";
import { Navigate, useNavigate, useParams } from "react-router-dom";

import TextField from "@mui/material/TextField";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import SimpleMDE from "react-simplemde-editor";

import "easymde/dist/easymde.min.css";
import styles from "./AddPost.module.scss";
import axios from "../../axiosQuery";

export const AddPost = () => {
  const isAuth = useSelector(selectIsAuth);
  const dispatch = useDispatch();
  const inputFileRef = useRef(null);
  const navigate = useNavigate();
  const { id } = useParams();

  const [isLoading, setLoading] = React.useState(false);
  const [text, setText] = React.useState("");
  const [title, setTitle] = React.useState("");
  const [tags, setTags] = React.useState("");
  const [imageUrl, setImageUrl] = React.useState("");

  const isEditing = Boolean(id);

  const handleChangeFile = async (event) => {
    try {
      const formData = new FormData();
      const file = event.target.files[0];
      formData.append("image", file);

      const { data } = await axios.post("/upload", formData);
      setImageUrl(data.url);
    } catch (error) {
      console.warn(error);
      alert("Ошибка загрузки файлов");
    }
  };

  const onClickRemoveImage = () => {
    setImageUrl("");
  };

  const onChange = React.useCallback((value) => {
    setText(value);
  }, []);

  const options = React.useMemo(
    () => ({
      spellChecker: false,
      maxHeight: "400px",
      autofocus: true,
      placeholder: "Введите текст...",
      status: false,
      autosave: {
        enabled: true,
        delay: 1000,
      },
    }),
    []
  );

  const onSubmit = async () => {
    try {
      setLoading(true);

      const fields = {
        text,
        title,
        tags,
        imageUrl,
      };

      const { data } = isEditing ? await axios.patch(`/posts/${id}`, fields) : await axios.post("/posts", fields);

      const _id = isEditing ? id : data._id;

      navigate(`/posts/${_id}`);
    } catch (error) {
      console.warn(error);
      alert("Ошибка при создании стати!");
    }
  };

  useEffect(() => {
    if (id) {
      axios
        .get(`/posts/${id}`)
        .then(({ data }) => {
          setText(data.text);
          setTitle(data.title);
          setTags(data.tags.join(","));
          setImageUrl(data.imageUrl);
        })
        .catch((error) => {
          console.warn(error);
          alert("Ошибка при получении стати");
        });
    }
  }, []);

  if (!window.localStorage.getItem("token") && !isAuth) {
    return <Navigate to={"/"} />;
  }

  return (
    <Paper style={{ padding: 30 }}>
      <Button variant="outlined" size="large" onClick={() => inputFileRef.current.click()}>
        Загрузить превью
      </Button>
      <input type="file" ref={inputFileRef} onChange={handleChangeFile} hidden />
      {imageUrl && (
        <>
          <Button variant="contained" color="error" onClick={onClickRemoveImage}>
            Удалить
          </Button>
          <img className={styles.image} src={`http://localhost:3333${imageUrl}`} alt="Uploaded" />
        </>
      )}
      <br />
      <br />
      <TextField
        classes={{ root: styles.title }}
        onChange={(e) => setTitle(e.target.value)}
        value={title}
        variant="standard"
        placeholder="Заголовок статьи..."
        fullWidth
      />
      <TextField
        classes={{ root: styles.tags }}
        onChange={(e) => setTags(e.target.value)}
        value={tags}
        variant="standard"
        placeholder="Тэги"
        fullWidth
      />
      <SimpleMDE className={styles.editor} value={text} onChange={onChange} options={options} />
      <div className={styles.buttons}>
        <Button onClick={onSubmit} size="large" variant="contained">
          {isEditing ? "Сохранить" : "Опубликовать"}
        </Button>
        <a href="/">
          <Button size="large">Отмена</Button>
        </a>
      </div>
    </Paper>
  );
};
