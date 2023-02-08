import styles from './EditPost.module.css'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import * as profileService from '../../services/profileService'
import * as postService  from '../../services/postService'

const EditPost = (props) => {
  const navigate = useNavigate()
  
  const location = useLocation()
  const { post } = location.state
  const [form, setForm] = useState(post)
  const [photoData, setPhotoData] = useState({})
  const [journeys, setJourneys] = useState([])

  useEffect(() => {
    const fetchJourneys = async () => {
      const profile = await profileService.getProfile(props.user.profile)
      setJourneys(profile.journeys)
    }
    fetchJourneys()
    console.log(journeys)
  }, [])

  const handleChange = ({ target }) => {
    setForm({ ...form, [target.name]: target.value })
  }

  const handleChangePhoto = (evt) => {
    setPhotoData(evt.target.files[0])
  }

  const handleSumbit = async (evt) => {
    evt.preventDefault()
    await postService.update(form, post._id)
    await postService.addPostPhoto(photoData, post._id)
    navigate(`/posts/${post._id}`)
  }

  const handleDeletePost = () => {
    postService.delete(post._id)
    navigate('/')
  }

  return (  
    <main className={styles.container}>
      <h1>Edit Post</h1>
      <form autoComplete='off' onSubmit={handleSumbit}>
        <div>
          <label htmlFor='title-input'>Title</label>
          <textarea
            required
            rows={1}
            cols={25}
            name='title'
            id='title-input'
            value={form.title}
            placeholder='title'
            onChange={handleChange}
          />
        </div>
        <div>
          <label htmlFor='category-input'>Category</label>
          <select
            required
            type='select'
            name='category'
            id='cateogry-input'
            value={form.category}
            onChange={handleChange}
          >
            <option value='Food'>Food</option>
            <option value='Fitness'>Fitness</option>
            <option value='BlogEntry'>Blog Entry</option>
          </select>
        </div>
        <div>
          <label htmlFor='journey-input'>Journey</label>
          <select
            required
            type='select'
            name='journey'
            id='journey-input'
            value={form.journey}
            onChange={handleChange}
          >
            <option value={form.journey.id}>{form.journey.name}</option>
            {/* <option value="">Select Journ/ey</option> */}
            {journeys.map(journey => 
              <option key={journey._id} value={journey._id}>{journey.name}</option>  
            )}
          </select>
        </div>
        <div className={styles.content}>
          <label htmlFor='content-input'>Post</label>
          <textarea
            required
            rows={5}
            cols={30}
            name='content'
            id='content-input'
            value={form.content}
            placeholder='Enter your post here'
            onChange={handleChange}
          />
        </div>
        <div className={styles.file}>
          <label htmlFor="photo-input" className={styles.photoInput}>Add a Photo</label>
          <input
            type='file'
            name='photo'
            id='photo-input'
            onChange={handleChangePhoto}
          />
        </div>
        <div>
          <button id={styles.edit}>Edit Post</button>
        </div>
      </form>
      <button id={styles.delete} onClick={() => handleDeletePost()}>Delete Post</button>
    </main>
  )
}

export default EditPost
