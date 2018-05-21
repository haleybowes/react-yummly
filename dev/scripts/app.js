import React from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';
import AppendRecipe from './AppendRecipe';
import SavedRecipe from './SavedRecipe';
import Footer from './Footer'
import firebase from 'firebase';
import { Link, DirectLink, Element, Events, animateScroll as scroll, scrollSpy, scroller } from 'react-scroll';
import classNames from 'classnames';



// initialize firebase
var config = {
  apiKey: "AIzaSyAdtggMCJncT0gRAcC0PzZqhot_A3uIlc0",
  authDomain: "yummly-search.firebaseapp.com",
  databaseURL: "https://yummly-search.firebaseio.com",
  projectId: "yummly-search",
  storageBucket: "",
  messagingSenderId: "658174692119"
};

firebase.initializeApp(config);

class App extends React.Component {
  constructor() {
    super();
    this.state = {
      nutrient: '',
      recipes: [],
      savedRecipe: [],
      allergy: '',
      diet: '',
      popUpText: false

    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.saveRecipe = this.saveRecipe.bind(this);
    this.removeRecipe = this.removeRecipe.bind(this);
    this.allergyChange = this.allergyChange.bind(this);
    this.dietChange = this.dietChange.bind(this);
    this.addClass = this.addClass.bind(this);
    this.removeClass = this.removeClass.bind(this);
  }

  addClass() {
    this.setState({
      popUpText: true
    });
  }

  removeClass() {
    this.setState({
      popUpText: false
    });
  }

  handleSubmit(e) {
    e.preventDefault();

    axios.get(' https://api.yummly.com/v1/api/recipes', {
      params: {
        _app_id: 'dfbe7dff',
        _app_key: '2bccb2cb18b4186352c9c884a2cff49a',
        requirePictures: true,
        maxResult: 9,
        'allowedDiet[]': `${this.state.diet}`,
        'allowedAllergy[]': `${this.state.allergy}`,
        q: this.state.nutrient
        
      }
    })
      .then((res) => {
        console.log(res.data.matches)
        let newArray = [];
        res.data.matches.forEach((match)=> 
        newArray.push(match.smallImageUrls));
        const newerArray = newArray.map((match) => match[0].split('=')[0]);

        res.data.matches[0].smallImageUrls = newerArray[0];

        for(let i = 0; i < res.data.matches.length; i++) {
          res.data.matches[i].smallImageUrls = newerArray[i];
        }

        this.setState({
          recipes: res.data.matches
        })

      }) 
    }

  handleChange(e) {
    this.setState({
      nutrient: e.target.value
    })
  }

  allergyChange(e) {
    this.setState({
      allergy: e.target.value
    })
  }

  dietChange(e) {
    this.setState({
      diet: e.target.value
    })
  }

    componentDidMount() {
      const dbRef = firebase.database().ref('recipe');
      dbRef.on('value', (snapshot) => {
        const data = snapshot.val();

        const recipeArray = [];

        for(let item in data) {
          data[item].key = item
          
          recipeArray.push(data[item])
        }

        this.setState({
          savedRecipe: recipeArray
        })
      })

      // adding smooth scroll

      Events.scrollEvent.register('begin', function () {
        console.log("begin", arguments);
      });

      Events.scrollEvent.register('end', function () {
        console.log("end", arguments);
      });
    }
// smoothScroll
  scrollTo() {
    scroller.scrollTo('scroll-to-element', {
      duration: 800,
      delay: 0,
      smooth: 'easeInOutQuart'
    })
  }
  
  componentWillUnmount() {
    Events.scrollEvent.remove('begin');
    Events.scrollEvent.remove('end');
  }

    saveRecipe(id) {

    let recipes = this.state.recipes

    const recipeToSave = recipes.filter((recipe) => {
      return recipe.id === id;
    })
   
    const dbRef = firebase.database().ref('recipe');
    dbRef.push(recipeToSave[0]);
  }

  removeRecipe(firebaseKey) {
    firebase.database().ref(`recipe/${firebaseKey}`).remove();
  }

  render() {
    const myRecipe = this.props.myRecipe;

      return (
       <div>

         <header>
            <img className="headerFood" src="../../images/blueberries-1.png" alt="blueberry icon" />
            <img className="headerFood" src="../../images/salad-1.png" alt="salad icon"/>
            <img className="headerFood" src="../../images/cauliflower-1.png" alt="cauliflower icon" />
            <img className="headerFood" src="../../images/onion-1.png" alt="onion icon"/>
            <img className="headerFood2 food1" src="../../images/blueberries-2.png" alt="blueberry icon" />
            <img className="headerFood2 food2" src="../../images/salad-2.png" alt="salad icon" />
            <img className="headerFood2 food3" src="../../images/cauliflower-2.png" alt="cauliflower icon" />
            <img className="headerFood2 food4" src="../../images/onion-2.png" alt="onion icon" />
          <h1>Whats Cookin'?!</h1>
          <form action="" onSubmit={this.handleSubmit}>
          <div className="majorSearch">
            <p>I feel like :</p>
            <input type="text" name="nutrient" onChange={this.handleChange} value={this.state.nutrient}/>
          </div>
          <div className="headerForm">
            <div>
              <select value={this.state.diet} onChange={this.dietChange}>
                <option value="">Dietery Restriction?</option>
                <option value="390^Vegan">Vegan</option>
                <option value="387^Lacto-ovo vegetarian">Lacto-ovo Vegetarian</option>
                <option value="390^Pescetarian">Pescatarian</option>
                <option value="388^Lacto vegetarian">Lacto Vegetarian</option>
              </select>
            </div>

            <div>
              <select value={this.state.allergy} onChange={this.allergyChange}>
                <option value="">Allergy?</option>
                <option value="393^Gluten-Free">Gluten Free</option>
                <option value="396^Dairy-Free">Dairy</option>
                <option value="398^Seafood-Free">Seafood</option>
              </select>
            </div>
          </div>
          <div className="submitSection">
            <input type="submit" value="Find a Recipe!" onClick={this.addClass}/>
            <Link activeClass="active" className="scroll" to="scroll" spy={true} smooth={true} duration={700}>
                <p className={classNames("boldTextClass", { "popUpTextClass": this.state.popUpText })}>Show me some grub!</p>
            </Link>
          </div>

        </form> 
      </header>
      <Element name="scroll" className="element">
        <div className="mainHeaderContainer">            
          <div className="h3Images">
            <img src="../../images/cabbage.png" alt=""/>
            <img src="../../images/cabbage.png" alt="" />
            <img src="../../images/cabbage.png" alt="" />
          </div>
          <h3 className="mainH3">Bon Appetit!</h3>
          <div className="h3Images">
            <img src="../../images/onion-3.png" alt="" />
            <img src="../../images/onion-3.png" alt="" />
            <img src="../../images/onion-3.png" alt="" />
          </div>
        </div>
      </Element>
          <div className="testing">
            {this.state.recipes.map((recipe) =>{
              return (
              <div>
                <AppendRecipe
                  recipeName={recipe.recipeName}
                  recipeUrl={recipe.smallImageUrls}
                  recipeId={recipe.id}
                  saveRecipe={this.saveRecipe}
                  key={recipe.key}
                  firebaseKey={recipe.key}
                />
              </div>
            )
          })} 
        </div>
          <div className="mainHeaderContainer">
            <div className="h3Images">
              <img src="../../images/carrot.png" alt="" />
              <img src="../../images/carrot.png" alt="" />
              <img src="../../images/carrot.png" alt="" />
            </div>
            <h3 className="mainH3">Saved Recipes</h3>
            <div className="h3Images">
              <img src="../../images/salad.png" alt="" />
              <img src="../../images/salad.png" alt="" />
              <img src="../../images/salad.png" alt="" />
            </div>
          </div>
        <div className="testing">
          {this.state.savedRecipe.map((recipe)=> {
            return (
              <div>
                <SavedRecipe 
                  recipeName={recipe.recipeName}
                  recipeUrl={recipe.smallImageUrls}
                  recipeId={recipe.id}
                  key={recipe.key}
                  firebaseKey={recipe.key}
                  removeRecipe={this.removeRecipe}
                  ingredients={recipe.ingredients}
                />
              </div>
            )
          })}
        </div>
        <Footer />
      </div>

      )
    }
  }




ReactDOM.render(<App />, document.getElementById('app'));
