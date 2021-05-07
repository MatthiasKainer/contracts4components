package de.matthiaskainer.c4c.web.testResult

import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule
import de.matthiaskainer.c4c.domain.TestRunResult
import de.matthiaskainer.c4c.domain.commands.CreateNewTestResult
import de.matthiaskainer.c4c.web.*
import io.ktor.application.*
import io.ktor.features.*
import io.ktor.http.*
import io.ktor.jackson.*
import io.ktor.routing.*
import io.ktor.server.testing.*
import org.junit.jupiter.api.Assertions
import org.spekframework.spek2.Spek
import org.spekframework.spek2.dsl.Skip
import org.spekframework.spek2.dsl.Skip.Yes
import java.time.LocalDateTime

object WhenRequestingTestResults : Spek({
    fun Application.testApp() {
        startApp()
        install(ContentNegotiation) {
            jackson {
                registerModule(JavaTimeModule())
            }
        }
        install(Routing) {
            with(employeeRoutingForTests) { contract("/contracts") }
        }
    }
    test("retrieves TestResults successfully") {
        withTestApplication(Application::testApp) {
            with(handleRequest(HttpMethod.Get, "/contracts/1/testResults")) {
                Assertions.assertEquals(HttpStatusCode.OK, response.status())
                Assertions.assertEquals(
                    1,
                    response.content?.toTestResults()?.size
                )
                Assertions.assertEquals(
                    testContract.versions["1.0.0"]?.testResults,
                    response.content?.toTestResults()
                )
            }
        }
    }
    test("retrieves the Results for a version") {
        withTestApplication(Application::testApp) {
            with(handleRequest(HttpMethod.Get, "/contracts/1/testResults/1.0.0")) {
                Assertions.assertEquals(HttpStatusCode.OK, response.status())
                Assertions.assertEquals(
                    testContract.versions["1.0.0"],
                    response.content?.toVersion()
                )
            }
        }
    }
    test("returns a not found if the version does not exist") {
        withTestApplication(Application::testApp) {
            with(handleRequest(HttpMethod.Get, "/contracts/1/testResults/1.0.1")) {
                Assertions.assertEquals(
                    HttpStatusCode.NotFound,
                    response.status()
                )
            }
        }
    }
    test("retrieves the latest TestResults") {
        withTestApplication(Application::testApp) {
            val creationDate = LocalDateTime.parse("2021-04-27T14:59:38.850")
            val result = CreateNewTestResult(
                creationDate,
                TestRunResult.Failure,
                "1.0.0"
            )
            with(handleRequest(HttpMethod.Put, "/contracts/1/testResults") {
                addHeader(
                    HttpHeaders.ContentType,
                    ContentType.Application.Json.toString()
                )
                setBody(
                    result.toJSON()
                )
            }) {
                Assertions.assertEquals(HttpStatusCode.Accepted, response.status())
            }
            with(handleRequest(HttpMethod.Get, "/contracts/1/testResults/1.0.0/latest")) {
                Assertions.assertEquals(HttpStatusCode.OK, response.status())
                Assertions.assertEquals(
                    result.toJSON().toTestResult(),
                    response.content?.toTestResult()
                )
            }
        }
    }
})