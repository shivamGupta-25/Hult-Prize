import  Banner  from './components/Banner'
import { About } from './components/About'
import { Nav } from './components/Nav'
import { Motto } from './components/Motto'
import Contact from './components/ContactUs'
import Footer from './components/Footer'

function App() {
  return (
    <>
      <Nav />
      <Banner />
      <Motto />
      <About />
      <Contact />
      <Footer />
    </>
  )
}

export default App
