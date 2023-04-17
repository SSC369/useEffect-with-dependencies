import {useState, useEffect} from 'react'
import Loader from 'react-loader-spinner'
import Header from '../Header'
import './index.css'

const Projects = props => {
  const {categoriesList} = props

  const [projectsData, getData] = useState([])
  const [apiResponse, getResponse] = useState('INITIAL')
  const [type, getType] = useState(categoriesList[0].id)

  const getProjectsData = async () => {
    getResponse('LOADING')
    const response = await fetch(
      `https://apis.ccbp.in/ps/projects?category=${type}`,
    )
    if (response.ok) {
      const data = await response.json()
      getData(data.projects)
      getResponse('SUCCESS')
    } else {
      getResponse('FAILURE')
    }
  }

  //  on every change of dependency value useEffect will called , if empty array is used as a dependency ,
  //   useEffect will be called one time that to when componentDidMount

  useEffect(() => {
    getProjectsData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [type])

  const loadingView = () => (
    <div data-testid="loader">
      <Loader type="ThreeDots" color="#00BFFF" height={50} width={50} />
    </div>
  )

  const renderFailureView = () => (
    <div>
      <img
        src="https://assets.ccbp.in/frontend/react-js/projects-showcase/failure-img.png"
        alt="failure view"
        className="failure-img"
      />
      <h1>Oops! Something Went Wrong</h1>
      <p>We cannot seem to find the page you are looking for.</p>
      <button type="button" onClick={() => getProjectsData()}>
        Retry
      </button>
    </div>
  )

  const renderSuccessView = () => (
    <ul>
      {projectsData.map(item => (
        <li key={item.id}>
          <img src={item.image_url} alt={item.name} className="image" />
          <p>{item.name}</p>
        </li>
      ))}
    </ul>
  )

  const renderData = () => {
    switch (apiResponse) {
      case 'SUCCESS':
        return renderSuccessView()

      case 'FAILURE':
        return renderFailureView()

      default:
        return loadingView()
    }
  }

  return (
    <div>
      <Header />
      <select onChange={e => getType(e.target.value)}>
        {categoriesList.map(item => (
          <option value={item.id} key={item.id}>
            {item.displayText}
          </option>
        ))}
      </select>

      {renderData()}
    </div>
  )
}

export default Projects
