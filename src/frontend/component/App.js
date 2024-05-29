import {
  Link,
  BrowserRouter,
  Routes,
  Route
} from "react-router-dom";
import { useState } from 'react'
import { ethers } from "ethers"
import MusicNFTMarketplaceAbi from '../contractsData/MusicNFTMarketplace.json'
import MusicNFTMarketplaceAddress from '../contractsData/MusicNFTMarketplace-address.json'
import { Spinner, Navbar, Nav, Button, Container } from 'react-bootstrap'
import logo from './logo.png'
import Home from './Home.js'
import MyTokens from './MyTokens.js'
import MyResales from './MyResales.js'
import './App.css';

function App() {
  const [loading, setLoading] = useState(true);
  const [account, setAccount] = useState(null);
  const [contract, setContract] = useState({});

  const web3Handler = async () => {
    try {
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      setAccount(accounts[0]);
      // Get provider from Metamask
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      // Get signer
      const signer = provider.getSigner();
      loadContract(signer);
    } catch (error) {
      console.error('Error connecting wallet:', error);
    }
  };

  const loadContract = async (signer) => {
    try {
      // Get deployed copy of music nft marketplace contract
      const contract = new ethers.Contract(MusicNFTMarketplaceAddress.address, MusicNFTMarketplaceAbi.abi, signer);
      setContract(contract);
      setLoading(false);
    } catch (error) {
      console.error('Error loading contract:', error);
    }
  };

  return (
    <BrowserRouter>
      <div className="App">
        <Navbar expand="lg" bg="dark" variant="dark" className="mb-4">
          <Container>
            <Navbar.Brand href="https://www.youtube.com/@rhpforreal">
              <img src={logo} width="40" height="40" className="d-inline-block align-top" alt="Music NFT player" />
              <span className="ml-2">RHP Music NFT</span>
            </Navbar.Brand>
            <Navbar.Toggle aria-controls="responsive-navbar-nav" />
            <Navbar.Collapse id="responsive-navbar-nav">
              <Nav className="mr-auto">
                <Nav.Link as={Link} to="/">Home</Nav.Link>
                <Nav.Link as={Link} to="/my-tokens">My Tokens</Nav.Link>
                <Nav.Link as={Link} to="/my-resales">My Resales</Nav.Link>
              </Nav>
              <Nav>
                  {account ? (
                    <Nav.Link
                      href={`https://etherscan.io/address/${account}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="button nav-button btn-sm mx-4">
                      <Button variant="outline-light">
                        {account.slice(0, 5) + '...' + account.slice(38, 42)}
                      </Button>

                    </Nav.Link>
                  ) : (
                    <Button onClick={web3Handler} variant="outline-light">Connect Wallet Here</Button>
                  )}
                </Nav>
            </Navbar.Collapse>
          </Container>
        </Navbar>
        
        <div className="content">
          {loading ? (
            <div className="loading-container">
              <Spinner animation="border" className="mr-3" />
              <p>Awaiting Metamask Connection...</p>
            </div>
          ) : (
            <Routes>
              <Route path="/" element={<Home contract={contract} />} />
              <Route path="/my-tokens" element={<MyTokens contract={contract} />} />
              <Route path="/my-resales" element={<MyResales contract={contract} account={account} />} />
            </Routes>
          )}
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;
