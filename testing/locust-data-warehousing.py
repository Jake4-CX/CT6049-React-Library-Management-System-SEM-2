from locust import HttpUser, between, task
import random

class APIUser(HttpUser):
  host = "http://localhost:8080/lws-backend-1.0-SNAPSHOT/api"
  wait_time = between(1, 5)
  
  accounts = [
    { "userEmail": "me@jack.lat", "userPassword": "Password1" },
    { "userEmail": "user2@example.com", "userPassword": "Password2" },
    { "userEmail": "user3@example.com", "userPassword": "Password3" },
    { "userEmail": "user4@example.com", "userPassword": "Password4" }
  ]
  
  def on_start(self):
    account = random.choice(self.accounts)
    self.login(account)
  
  def login(self, account):
    with self.client.post("/users/login", json=account, catch_response=True) as response:
      if response.status_code == 200:
        self.accessToken = response.json()["data"]["token"]["accessToken"]
        self.userRole = response.json()["data"]["user"]["userRole"]
      else:
        response.failure("Failed to login")
        self.accessToken = None
        self.userRole = None
  
  @task
  def perform_requests(self):
    if not self.accessToken:
      return
    
    if self.userRole == "LIBRARIAN":
      self.librarian_requests(self.accessToken)
    elif self.userRole == "CHIEF_LIBRARIAN":
      self.chief_librarian_requests(self.accessToken)
    elif self.userRole == "FINANCE_DIRECTOR":
      self.finance_director_requests(self.accessToken)
    else:
      print("User role not recognized")
  
  def librarian_requests(self, accessToken):
    headers = {"Authorization": f"Bearer {accessToken}"}
    duration = random.randint(86400000, 31536000000)
    
    # librarian requests
    self.client.get(f"/librarian/average/borrowed-books/duration/{duration}", headers=headers)
    self.client.get("/librarian/popular/currently-loaned/author", headers=headers)
    self.client.get("/librarian/popular/currently-loaned/category", headers=headers)
    self.client.get("/librarian/percentage/currently-loaned/", headers=headers)
    self.client.get("/librarian/books-per-category", headers=headers)
    self.client.get("/librarian/authors-per-category", headers=headers)
    
  def chief_librarian_requests(self, accessToken):
    headers = {"Authorization": f"Bearer {accessToken}"}
    duration = random.randint(86400000, 31536000000)
    
    # chief librarian requests
    self.client.get("/chief-librarian/average/books-author", headers=headers)
    self.client.get("/chief-librarian/average/books-category", headers=headers)
    self.client.get("/chief-librarian/average/loan-duration/year", headers=headers)
    self.client.get(f"/chief-librarian/average/loan-duration/duration/{duration}", headers=headers)
    self.client.get("/chief-librarian/average/time-pay-fine", headers=headers)
    self.client.get("/chief-librarian/percentage/books-overdue", headers=headers)
    self.client.get("/chief-librarian/percentage/books-late", headers=headers)
    
  def finance_director_requests(self, accessToken):
    headers = {"Authorization": f"Bearer {accessToken}"}
    duration = random.randint(86400000, 31536000000)
    
    # finance director requests
    self.client.get("/finance-director/popular/unpaid/category", headers=headers)
    self.client.get("/finance-director/popular/unpaid/author", headers=headers)
    self.client.get(f"/finance-director/average/fines/duration/{duration}", headers=headers)
    self.client.get("/finance-director/percentage/unpaid-fines", headers=headers)
    self.client.get("/finance-director/total/unpaid-fines", headers=headers)