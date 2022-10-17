import axios from 'axios';

import { useEffect, useState } from 'react'

import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';
import Form from 'react-bootstrap/Form';
import Dropdown from 'react-bootstrap/Dropdown';
import Button from 'react-bootstrap/Button';

var he = require('he');



function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

function Game() {

    const [gameOn, setGameOn] = useState(false);

    const [apiResponse, setApiResponse] = useState(null);

    const [questionNumber, setQuestionNumber] = useState(0);
    const [questionText, setQuestionText] = useState("");

    const [answerArray, setAnswerArray] = useState([]);
    const [correctAnswer, setCorrectAnswer] = useState("");

    const [score, setScore] = useState(0);
    const [opponentScore, setOpponentScore] = useState(0);

    const [canClick, setCanClick] = useState(true);
    const [showSlider, setShowSlider] = useState(false);
    const [rangeValue, setRangeValue] = useState(100);
    const [rangeColor, setRangeColor] = useState("orange");


    const [category, setCategory] = useState("");
    const [difficulty, setDifficulty] = useState("");
    let categories = [{ name: "Any", id: "" }, { name: "General Knowledge", id: "&category=9" }, { name: "Entertainment: Books", id: "&category=10" }]

    let API_URL = `https://opentdb.com/api.php?amount=20${category}${difficulty}&type=multiple`;
    let optionsText = "Choose a category and/or difficulty. If you hit play without choosing, all individual question category and difficulty will be randomized.";

    const handleAnswerClick = (event) => {
        let countdown = 3;
        let newRangeValue = 100;
        if (score < 10 && opponentScore < 10 && canClick) {
            console.log(event.target.getAttribute("data-answer"));
            setCanClick(false);
            if (correctAnswer === event.target.getAttribute("data-answer")) {
                console.log("correct selection");
                setScore(score + 1);
                setRangeColor("green");
            } else {
                console.log("incorrect selection");
                setOpponentScore(opponentScore + 1);
                setRangeColor("red");
            }
            let myInterval = setInterval(function () {
                countdown--;
                // console.log(countdown);
            }, 1000);

            let rangeInterval = setInterval(function () {
                setShowSlider(true);
                newRangeValue = newRangeValue - 1;
                setRangeValue(newRangeValue);
                // console.log(rangeValue);
            }, 30);

            setTimeout(() => {
                setQuestionNumber(questionNumber + 1);
                clearInterval(myInterval);
                clearInterval(rangeInterval);
                setCanClick(true);
                setShowSlider(false);
            }, 3000);


        }
    }

    const handleCategoryClick = (event) => {
        console.log(event.target.getAttribute("data-cat"));
        setCategory(event.target.getAttribute("data-cat"));
    }

    const handleDifficultyClick = (event) => {
        console.log(event.target.getAttribute("data-dif"));
        setDifficulty(event.target.getAttribute("data-dif"));

    }

    const handlePlayClick = (event) => {
        setGameOn(true);
    }

    const handlePlayAgainClick = (event) => {
        setGameOn(false);
        setScore(0);
    }

    useEffect(() => {
        setQuestionText(optionsText);
        if (gameOn) {

            setQuestionNumber(0);
            axios.get(`${API_URL}`).then(function (response) {
                console.log(response.data);
                setApiResponse(response.data.results);
                let codedQuestion = response.data.results[questionNumber].question;
                let decodedQuestion = he.decode(codedQuestion);
                let incAnswers = [];
                setQuestionText(decodedQuestion);
                let codedIncAnswers = response.data.results[questionNumber].incorrect_answers;
                codedIncAnswers.map((answer) => {
                    return incAnswers.push(he.decode(answer));

                });
                let corAnswer = he.decode(response.data.results[questionNumber].correct_answer);
                setCorrectAnswer(corAnswer);
                incAnswers.push(corAnswer)
                console.log(incAnswers);
                shuffleArray(incAnswers);
                setAnswerArray(incAnswers);
            });
        }

    }, [gameOn]);

    useEffect(() => {
        if (apiResponse && score < 10 && opponentScore < 10) {
            setQuestionText(he.decode(apiResponse[questionNumber].question));

            let incAnswers = [];
            let codedIncAnswers = apiResponse[questionNumber].incorrect_answers;
            codedIncAnswers.map((answer) => {
                return incAnswers.push(he.decode(answer));

            });
            let corAnswer = he.decode(apiResponse[questionNumber].correct_answer);
            setCorrectAnswer(corAnswer);
            incAnswers.push(corAnswer)
            shuffleArray(incAnswers);
            setAnswerArray(incAnswers);
        } else {
            if (!gameOn) {
                setQuestionText(optionsText);
            } else if (score >= 10) {
                setQuestionText("You Win!");
            } else {
                setQuestionText("You Lose!");
            }
        }
    }, [questionNumber]);



    return (
        <Container className='mainContainer'>

            <Row>
                <Col className='questionArea'>
                    <h3>{questionText}</h3>
                    {score > 0 &&
                        <Button onClick={handlePlayAgainClick}>Play again?</Button>
                    }
                </Col>
                <Col>
                    {answerArray &&
                        <Card className='cardHeight'>
                            <Card.Body>
                                {/* <Card.Title></Card.Title> */}

                                {!gameOn &&
                                    <div>
                                        <Dropdown>
                                            <Dropdown.Toggle variant="info" style={{ width: "100%" }} id="dropdown-basic">
                                                Category
                                            </Dropdown.Toggle>

                                            <Dropdown.Menu>
                                                {categories.map((cat) => {
                                                    return (
                                                        <Dropdown.Item key={cat.name} data-cat={cat.id} onClick={handleCategoryClick}>
                                                            {cat.name}
                                                        </Dropdown.Item>
                                                    )
                                                })}
                                            </Dropdown.Menu>
                                        </Dropdown>

                                        <Dropdown>
                                            <Dropdown.Toggle variant="info" style={{ width: "100%" }} id="dropdown-basic">
                                                Difficulty
                                            </Dropdown.Toggle>

                                            <Dropdown.Menu>
                                                <Dropdown.Item key={"&difficulty=easy"}  data-dif="&difficulty=easy" onClick={handleDifficultyClick}>Easy</Dropdown.Item>
                                                <Dropdown.Item key={"&difficulty=medium"} data-dif="&difficulty=medium" onClick={handleDifficultyClick}>Medium</Dropdown.Item>
                                                <Dropdown.Item key={"&difficulty=hard"} data-dif="&difficulty=hard" onClick={handleDifficultyClick}>Hard</Dropdown.Item>
                                            </Dropdown.Menu>
                                        </Dropdown>
                                        <Button variant="primary" style={{ width: "100%" }} onClick={handlePlayClick}>Play!</Button>
                                    </div>




                                }

                                {gameOn && answerArray.map((results) => {
                                    return (
                                        <Card.Text key={Math.floor(Math.random() * 1000)}>
                                            <Button className="bigButton" key={Math.floor(Math.random() * 100)} data-answer={results} onClick={handleAnswerClick}>
                                                {results}
                                            </Button>
                                        </Card.Text>
                                    )
                                })}
                                {/* <h2>Score: {score}</h2> */}
                            </Card.Body>
                            {/* {score}
                            {opponentScore} */}
                        </Card>
                    }
                </Col>
            </Row>
            <Row>
                {showSlider &&
                    <Form.Range style={{ width: `${rangeValue}%`, background: `${rangeColor}`, "borderRadius": "25px", marginTop: "10px" }} />
                }
            </Row>
        </Container>
    )
}
export default Game;