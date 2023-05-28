const code = ` <!-- SIGN UP MODAL -->
  <div id="modal-signup" class="mymodal">
    <div class="modalContent">
      <h3 style="margin-bottom: 20px; font-weight: bold; text-align: center">
        <i class="fa fa-pencil-square-o"></i> <u>Zaregistruj sa</u>
      </h3>
      <form id="signup-form" class="form-horizontal">
        <fieldset>
          <div class="form-group">
            <div class="col-lg-8 col-lg-offset-2">
              <input type="email" class="form-control" id="signup-email" required placeholder="Zadaj svoj email">
            </div>
          </div>
          <div class="form-group">
            <div class="col-lg-8 col-lg-offset-2">
              <input type="password" class="form-control" id="signup-password" placeholder="Zadaj heslo">
            </div>
          </div>
          <div class="form-group">
            <div class="col-lg-8 col-lg-offset-2">
              <input type="text" class="form-control" id="signup-name" required placeholder="Meno">
            </div>
          </div>
          <div class="form-group">
            <div style="text-align: center">
              <button type="submit" class="btn btn-warning">Zaregistruj sa</button>
            </div>
          </div>
        </fieldset>
      </form>
    </div>
  </div>

  <!-- LOGIN MODAL -->
  <div id="modal-login" class="mymodal">
    <div class="modalContent">
      <h3 style="margin-bottom: 20px; font-weight: bold; text-align: center">
        <i class="fa fa-user"></i> <u>Prihlás sa</u>
      </h3>
      <form id="login-form" class="form-horizontal">
        <fieldset>
          <div class="form-group">
            <div class="col-lg-8 col-lg-offset-2">
              <input type="email" class="form-control" id="login-email" required placeholder="Email">
            </div>
          </div>
          <div class="form-group">
            <div class="col-lg-8 col-lg-offset-2">
              <input type="password" class="form-control" id="login-password" placeholder="Heslo">
            </div>
          </div>
          <div class="form-group">
            <div style="text-align: center">
              <button type="submit" class="btn btn-warning">Prihlás sa</button>
            </div>
          </div>
        </fieldset>
      </form>
    </div>
  </div>
`
document.write(code);