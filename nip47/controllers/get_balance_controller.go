package controllers

import (
	"context"

	"github.com/getAlby/hub/lnclient"
	"github.com/getAlby/hub/logger"
	"github.com/getAlby/hub/nip47/models"
	"github.com/nbd-wtf/go-nostr"
	"github.com/sirupsen/logrus"
)

const (
	MSAT_PER_SAT = 1000
)

type getBalanceResponse struct {
	Balance int64 `json:"balance"`
	// MaxAmount     int    `json:"max_amount"`
	// BudgetRenewal string `json:"budget_renewal"`
}

type getBalanceController struct {
	lnClient lnclient.LNClient
}

func NewGetBalanceController(lnClient lnclient.LNClient) *getBalanceController {
	return &getBalanceController{
		lnClient: lnClient,
	}
}

// TODO: remove checkPermission - can it be a middleware?
func (controller *getBalanceController) HandleGetBalanceEvent(ctx context.Context, nip47Request *models.Request, requestEventId uint, checkPermission checkPermissionFunc, publishResponse publishFunc) {
	// basic permissions check
	resp := checkPermission(0)
	if resp != nil {
		publishResponse(resp, nostr.Tags{})
		return
	}

	logger.Logger.WithFields(logrus.Fields{
		"request_event_id": requestEventId,
	}).Info("Getting balance")

	balance, err := controller.lnClient.GetBalance(ctx)
	if err != nil {
		logger.Logger.WithFields(logrus.Fields{
			"request_event_id": requestEventId,
		}).WithError(err).Error("Failed to fetch balance")
		publishResponse(&models.Response{
			ResultType: nip47Request.Method,
			Error: &models.Error{
				Code:    models.ERROR_INTERNAL,
				Message: err.Error(),
			},
		}, nostr.Tags{})
		return
	}

	responsePayload := &getBalanceResponse{
		Balance: balance,
	}

	// this is not part of the spec and does not seem to be used
	/*appPermission := db.AppPermission{}
	controller.db.Where("app_id = ? AND request_method = ?", app.ID, models.PAY_INVOICE_METHOD).First(&appPermission)

	maxAmount := appPermission.MaxAmount
	if maxAmount > 0 {
		responsePayload.MaxAmount = maxAmount * MSAT_PER_SAT
		responsePayload.BudgetRenewal = appPermission.BudgetRenewal
	}*/

	publishResponse(&models.Response{
		ResultType: nip47Request.Method,
		Result:     responsePayload,
	}, nostr.Tags{})
}
