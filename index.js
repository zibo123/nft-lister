    window.userAddress = null;
    window.onload = async () => {
      // Init Web3 connected to ETH network
      if (!window.ethereum) {
        alert("Metamask Not Installed");
      }
      window.userAddress = window.localStorage.getItem("userAddress");
      showAddress();
    };

    function walletAddress(address) {
      if (!address) {
        return "";
      }
      return `${address}`;
    }

    // Remove Address
    function showAddress() {
      if (!window.userAddress) {
        document.getElementById("userAddress").innerText = "";
        document.getElementById("logBtn").classList.add("hidden");
        return false;
      }

      document.getElementById(
        "userAddress"
      ).innerText = `ETH Address: ${walletAddress(window.userAddress)}`;
      document.getElementById("logBtn").classList.remove("hidden");
    }

    // logout
    function logout() {
      window.userAddress = null;
      window.localStorage.removeItem("userAddress");
      showAddress();
    }

       async function loginWithMeta() {
      if (window.ethereum) {
        try {
          const selectedAccount = await window.ethereum
            .request({
              method: "eth_requestAccounts",
            })
            .then((accounts) => accounts[0])
            .catch(() => {
              throw Error("No account!");
            });
          window.userAddress = selectedAccount;
          window.localStorage.setItem("userAddress", selectedAccount);
          showAddress();
        } catch (error) {
          console.error(error);
        }
      } else {
        alert("Metamask Not Installed.");
      }
    }

    async function getItem() {
      if (!window.userAddress) { return }
      const osContainer = document.getElementById('openseaNFTs')

      const items = await fetch(`https://api.opensea.io/api/v1/assets?owner=${window.userAddress}&order_direction=desc&offset=0&limit=50`)
        .then((res) => res.json())
        .then((res) => {
          return res.assets
        })
        .catch((e) => {
          console.error(e)
          console.error('Connection Failed')
          return null
        })

      if (items.length === 0) { return }

      items.forEach((nft) => {
        const { name, image_url, description, permalink } = nft

        const nftEle = document.createElement('div')
        nftEle.innerHTML = `
        <img src='${image_url}'/>
        <p>${name}</p>
        <p>${description ?? ''}</p>
        <a href='${permalink}'> </a>
        `
        osContainer.appendChild(nftEle)
      })
    }
